"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, BookOpen, Loader2, Edit, Trash2, Calendar, Clock,  Settings, FileQuestion } from "lucide-react";
import { toast } from "sonner";
import { useCreateAssessment } from "@/features/admin/hooks/useCreateAssessment";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAssessmentTests } from "@/features/admin/hooks/useGetAssessmentTests";
import { AssessmentTest } from "@/types/assessmentTest";

// Form schema với validation
const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});

type FormData = z.infer<typeof formSchema>;


const AssessmentManagementPage = () => {
  const { mutate: createAssessment, isPending } = useCreateAssessment();
  const {data: assessments, isLoading, isError, error, refetch} = useGetAssessmentTests();
  const [showAddForm, setShowAddForm] = useState(false);

  // Shadcn form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (values: FormData) => {
    createAssessment(values, {
      onSuccess: () => {
        form.reset(); // Reset form
        setShowAddForm(false);
        refetch(); // Refresh data after creating
        toast.success("Tạo bài test thành công!");
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi xảy ra khi tạo bài test!");
      },
    });
  };

  const handleCancelForm = () => {
    form.reset();
    setShowAddForm(false);
  };

  // Helper function to render status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, text: "Hoạt động", className: "bg-green-100 text-green-700 border-green-200" },
      inactive: { variant: "outline" as const, text: "Không hoạt động", className: "bg-red-100 text-red-700 border-red-200" }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  // Handle actions
  const handleCreateQuestions = (id: string) => {
    toast.info(`Tạo câu hỏi đáp án cho bài test #${id}`);
  };

  const handleEdit = (id: string) => {
    toast.info(`Chỉnh sửa thông tin bài test #${id}`);
  };

  const handleDelete = (id: string) => {
    toast.info(`Xóa bài test #${id}`);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/20 via-blue-100/10 to-purple-100/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cyan-100/60 to-blue-100/60 rounded-xl">
                  <BookOpen className="w-6 h-6 text-cyan-600" />
                </div>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
                  Assessment Management
                </h1>
              
              </div>
              <p className="text-slate-600 text-base ml-11">
                Quản lý và tạo các bài kiểm tra đầu vào
              </p>
            </div>

            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 px-4 py-2 font-semibold rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo bài test mới
            </Button>
          </div>
        </div>
      </div>


      {/* Add Assessment Modal */}
      {showAddForm && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.10)]  rounded-2xl flex justify-center items-center z-50 h-full"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelForm();
            }
          }}
        >
          <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/20 via-blue-100/10 to-purple-100/20 rounded-2xl blur-xl"></div>
            <Card className="relative bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-slate-100/50 p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-cyan-100/60 to-blue-100/60 rounded-lg">
                      <BookOpen className="w-5 h-5 text-cyan-600" />
                    </div>
                    <span className="bg-gradient-to-r from-slate-800 to-cyan-700 bg-clip-text text-transparent font-semibold">
                      Tạo bài test mới
                    </span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelForm}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <Plus className="w-4 h-4 rotate-45" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Tiêu đề bài test
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Nhập tiêu đề bài test..."
                          {...field}
                          className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 disabled:opacity-50 transition-all duration-200 rounded-lg h-12"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Mô tả
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả chi tiết về bài test..."
                          {...field}
                          disabled={isPending}
                          rows={4}
                          className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 disabled:opacity-50 transition-all duration-200 rounded-lg resize-none"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/60">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={handleCancelForm}
                    className="border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-50 transition-all duration-200 px-6 py-2 rounded-lg"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 transition-all duration-200 px-6 py-2 rounded-lg font-semibold"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      "Tạo bài test"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
          </div>
        </div>
      )}

      {/* Assessment Tests List */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/20 via-blue-100/10 to-purple-100/20 rounded-2xl blur-xl"></div>
        <Card className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-slate-100/50 p-6">
            <CardTitle className="text-slate-800 flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-cyan-100/60 to-blue-100/60 rounded-lg">
                <BookOpen className="w-5 h-5 text-cyan-600" />
              </div>
              <span className="bg-gradient-to-r from-slate-800 to-cyan-700 bg-clip-text text-transparent font-semibold">
                Danh sách bài kiểm tra ({assessments?.length || 0})
              </span>
            </CardTitle>
          </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center text-slate-600 py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-cyan-500 animate-spin" />
              <p className="text-lg mb-2">Đang tải dữ liệu...</p>
            </div>
          ) : isError ? (
            <div className="text-center text-slate-600 py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-500" />
              <p className="text-lg mb-2 text-red-500">Có lỗi xảy ra khi tải dữ liệu</p>
              <p className="text-sm mb-4 text-slate-600">{error?.message || "Vui lòng thử lại"}</p>
              <Button onClick={() => refetch()} variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-100">
                Thử lại
              </Button>
            </div>
          ) : (!assessments || assessments.length === 0) ? (
            <div className="text-center text-slate-600 py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-500" />
              <p className="text-lg mb-2">Chưa có bài test nào</p>
              <p className="text-sm">Hãy tạo bài test đầu tiên của bạn</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {assessments?.map((assessment: AssessmentTest, index) => (
                <div 
                  key={assessment.id} 
                  className="group relative animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-100/30 via-blue-100/30 to-purple-100/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Card */}
                  <div className="relative bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 hover:border-slate-300/60 hover:bg-white/80 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-cyan-100/60 to-blue-100/60 rounded-xl group-hover:from-cyan-100/80 group-hover:to-blue-100/80 transition-all duration-300">
                          <BookOpen className="w-5 h-5 text-cyan-600 group-hover:text-cyan-700" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Assessment Test</span>
                          <span className="text-sm text-slate-400">ID: {assessment.id}</span>
                        </div>
                      </div>
                      {getStatusBadge("active")}
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-cyan-700 transition-colors duration-300 line-clamp-2 leading-tight">
                          {assessment.title}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                          {assessment.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-cyan-500" />
                          <span className="text-sm font-medium">
                            {new Date(assessment.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Vừa tạo</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-200/60">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-105"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="w-48 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg"
                        >
                          <DropdownMenuItem 
                            onClick={() => handleCreateQuestions(assessment.id)}
                            className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            <FileQuestion className="w-4 h-4 text-emerald-500" />
                            <span className="font-medium">Tạo câu hỏi đáp án</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEdit(assessment.id)}
                            className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            <Edit className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">Chỉnh sửa thông tin</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(assessment.id)}
                            className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                            <span className="font-medium">Xóa bài test</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-cyan-100/20 to-blue-100/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default AssessmentManagementPage;
