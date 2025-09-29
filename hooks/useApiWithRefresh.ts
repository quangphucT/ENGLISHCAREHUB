// hooks/useApiWithRefresh.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errorCode?: string;
  status?: number;
}

export function useApiWithRefresh() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const callApi = useCallback(async <T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T> | null> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      // Nếu token expired, thử refresh
      if (response.status === 401 && data.errorCode === 'TOKEN_EXPIRED') {
        const refreshResponse = await fetch('/api/auth/refresh-token', {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          // Retry API call sau khi refresh thành công
          const retryResponse = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
          });

          const retryData: ApiResponse<T> = await retryResponse.json();
          
          if (retryResponse.ok) {
            return retryData;
          } else {
            throw new Error(retryData.message || 'API call failed after refresh');
          }
        } else {
          // Check if refresh token expired
          const refreshData = await refreshResponse.json();
          if (refreshData.errorCode === 'REFRESH_TOKEN_EXPIRED' || refreshData.redirectToLogin) {
            // Use utility function to handle token expiration
            const { handleTokenExpiration } = await import('@/utils/auth');
            handleTokenExpiration();
          } else {
            toast.error('Có lỗi xảy ra khi làm mới phiên đăng nhập.');
          }
          return null;
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'API call failed');
      }

      return data;
    } catch (error) {
      console.error('API call error:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return { callApi, isLoading };
}