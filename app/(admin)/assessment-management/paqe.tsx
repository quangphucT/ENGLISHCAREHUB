"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, BookOpen, Loader2, Trash2, Calendar, Clock, Settings, FileQuestion, X } from "lucide-react";
import { toast } from "sonner";
import { useCreateAssessment } from "@/features/admin/hooks/useCreateAssessment";
import { useCreateQuestionAnswer } from "@/features/admin/hooks/useCreateQuestionAnswer";
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
import { AssessmentTest, QuestionAssessment } from "@/types/assessmentTest";
import { useGetQuestionsByTestId } from "@/features/admin/hooks/useGetQuestionsByTestId";

// Form schema với validation
const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Question schema cho câu hỏi trắc nghiệm
const questionSchema = z.object({
  content: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  options: z.array(z.object({
    content: z.string().min(1, "Nội dung lựa chọn không được để trống"),
    correct: z.boolean(),
  })).length(4, "Phải có đúng 4 lựa chọn"),
});

type FormData = z.infer<typeof formSchema>;
type QuestionData = z.infer<typeof questionSchema>;


const AssessmentManagementPage = () => {
  const { mutate: createAssessment, isPending } = useCreateAssessment();
  const { mutate: createQuestionAnswer, isPending: isQuestionPending } = useCreateQuestionAnswer();
  const {data: assessments, isLoading, isError, error, refetch} = useGetAssessmentTests();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentTest | null>(null);
  
  // Hook lấy câu hỏi theo assessment ID
  const {data: questionsAnswers, isLoading: isLoadingQuestions, refetch: refetchQuestions} = useGetQuestionsByTestId(
    selectedAssessment?.id || "",
    !!selectedAssessment?.id
  );


  // Shadcn form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Question form setup
  const questionForm = useForm<QuestionData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: "",
      options: [
        { content: "", correct: false },
        { content: "", correct: false },
        { content: "", correct: false },
        { content: "", correct: false },
      ],
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




  const onQuestionSubmit = (values: QuestionData) => {
    // Kiểm tra có ít nhất 1 đáp án đúng
    const hasCorrectAnswer = values.options.some(option => option.correct);

    if (!hasCorrectAnswer) {
      toast.error("Phải có ít nhất 1 đáp án đúng!");
      return;
    }

    if (!selectedAssessmentId) {
      toast.error("Không tìm thấy ID bài test!");
      return;
    }
     

    // Gọi API tạo câu hỏi
    createQuestionAnswer(
      { testId: selectedAssessmentId, data: values },
      {
        onSuccess: () => {
          toast.success("Tạo câu hỏi thành công!");
          // Refetch questions để cập nhật danh sách
          if (selectedAssessment?.id) {
            refetchQuestions();
          }
          // Reset form nhưng không đóng modal
          questionForm.reset({
            content: "",
            options: [
              { content: "", correct: false },
              { content: "", correct: false },
              { content: "", correct: false },
              { content: "", correct: false },
            ],
          });
        },
        onError: (error) => {
          toast.error(error.message || "Có lỗi xảy ra khi tạo câu hỏi!");
        },
      }
    );
  };

  const handleCancelQuestionForm = () => {
    questionForm.reset();
    setShowCreateQuestionModal(false);
    setSelectedAssessmentId(null);
  };

  const handleCorrectAnswerChange = (optionIndex: number) => {
    const currentOptions = questionForm.getValues("options");
    const updatedOptions = currentOptions.map((option, index) => ({
      ...option,
      correct: index === optionIndex
    }));
    questionForm.setValue("options", updatedOptions);
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
    setSelectedAssessmentId(id);

    setShowCreateQuestionModal(true);
  };

  const handleViewDetail = (assessment: AssessmentTest) => {
    setSelectedAssessment(assessment);
    setShowDetailModal(true);
    // Hook sẽ tự động gọi API khi selectedAssessment thay đổi
  };


  const handleCloseDetailModal = () => {
    setSelectedAssessment(null);
    setShowDetailModal(false);
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
              className="bg-gradient-to-r cursor-pointer from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 px-4 py-2 font-semibold rounded-lg"
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
          className="fixed inset-0 bg-[rgba(0,0,0,0.10)] flex justify-center items-center z-50 h-full"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelForm();
            }
          }}
        >
          <div className="relative w-full max-w-[600px] animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/20 via-blue-100/10 to-purple-100/20 blur-xl"></div>
            <Card className="relative bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-slate-100/50 p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-cyan-100/60 to-blue-100/60">
                      <BookOpen className="w-5 h-5 text-cyan-600" />
                    </div>
                    <Button className="bg-gradient-to-r  from-slate-800 to-cyan-700 bg-clip-text text-transparent font-semibold">
                      Tạo bài test mới
                    </Button>
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
                          className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 disabled:opacity-50 transition-all duration-200 h-12"
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
                          className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 disabled:opacity-50 transition-all duration-200 resize-none"
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
                    className="border-slate-300 cursor-pointer text-slate-600 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-50 transition-all duration-200 px-6 py-2"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-gradient-to-r cursor-pointer from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 transition-all duration-200 px-6 py-2 font-semibold"
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

      {/* Create Question Modal */}
      {showCreateQuestionModal && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.15)] flex justify-center items-center z-50 h-full"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelQuestionForm();
            }
          }}
        >
          <div className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0 blur-xl"></div>
            <Card className="relative bg-white/95 backdrop-blur-sm border shadow-2xl overflow-hidden">
              <CardHeader className=" p-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 flex items-center gap-3 text-2xl">
                    <div className="p-3 bg-gradient-to-r from-emerald-100/60 to-cyan-100/60">
                      <FileQuestion className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent font-bold">
                      Tạo câu hỏi trắc nghiệm
                    </span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelQuestionForm}
                    className="h-10 w-10 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
           
              </CardHeader>

              <CardContent className="p-8">
                <Form {...questionForm}>
                  <form
                    onSubmit={questionForm.handleSubmit(onQuestionSubmit)}
                    className="space-y-8"
                  >
                    {/* Question Content */}
                    <FormField
                      control={questionForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-lg font-semibold text-slate-700 flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            Nội dung câu hỏi
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập nội dung câu hỏi trắc nghiệm..."
                              {...field}
                              rows={4}
                              className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500/50 transition-all duration-300 resize-none p-4 text-base shadow-sm hover:shadow-md"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Options */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-slate-700">Các lựa chọn đáp án</h3>
                      </div>
                      
                      <div className="grid gap-4">
                        {[0, 1, 2, 3].map((index) => (
                          <div key={index} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-slate-100/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative bg-white/70 border border-slate-200 p-6 hover:bg-white/90 transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 font-bold text-lg flex-shrink-0 mt-1">
                                  {String.fromCharCode(65 + index)}
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                  <FormField
                                    control={questionForm.control}
                                    name={`options.${index}.content`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder={`Nhập nội dung lựa chọn ${String.fromCharCode(65 + index)}...`}
                                            {...field}
                                            className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 h-12 text-base px-4 shadow-sm hover:shadow-md"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm" />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={questionForm.control}
                                    name={`options.${index}.correct`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <div className="flex items-center space-x-3">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value}
                                              onCheckedChange={(checked) => {
                                                if (checked) {
                                                  handleCorrectAnswerChange(index);
                                                }
                                              }}
                                              className="w-5 h-5 border-2 border-green-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-medium text-slate-600 cursor-pointer">
                                            Đáp án đúng
                                          </FormLabel>
                                        </div>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-8 border-t border-slate-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelQuestionForm}
                        disabled={isQuestionPending}
                        className="flex-1 py-3 px-6 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-medium text-base shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                      >
                        Đóng
                      </Button>
                      <Button
                        type="submit"
                        disabled={isQuestionPending}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isQuestionPending ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang tạo...</span>
                          </div>
                        ) : (
                          "Tạo câu hỏi" 
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

      {/* Assessment Detail Modal */}
      {showDetailModal && selectedAssessment && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.25)] flex justify-center items-center z-50 h-full rounded-2xl"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseDetailModal();
            }
          }}
        >
          <div className="relative w-full max-w-5xl max-h-[75vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0 blur-xl"></div>
            <Card className="relative bg-white/95 backdrop-blur-sm border shadow-2xl overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-100/60 to-cyan-100/60">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-800">
                        Chi tiết bài test
                      </CardTitle>
                      <p className="text-slate-600 mt-1">ID: {selectedAssessment.id}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseDetailModal}
                    className="h-10 w-10 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Assessment Info */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Thông tin bài test
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-600">Tiêu đề:</label>
                          <p className="text-slate-800 font-medium mt-1">{selectedAssessment.title}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-600">Mô tả:</label>
                          <p className="text-slate-700 mt-1 leading-relaxed">{selectedAssessment.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan-500" />
                            <span className="text-sm text-slate-600">
                              Ngày tạo: {new Date(selectedAssessment.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FileQuestion className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-slate-600">
                              Tổng câu hỏi: {isLoadingQuestions ? '...' : (questionsAnswers?.length || 0)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-slate-600">Trạng thái: Hoạt động</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-slate-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Danh sách câu hỏi ({isLoadingQuestions ? '...' : (questionsAnswers?.length || 0)})
                      </h3>
                      
                      <div className="space-y-6 max-h-[500px] overflow-y-auto">
                        {isLoadingQuestions ? (
                          <div className="text-center py-12 text-slate-500">
                            <Loader2 className="w-8 h-8 mx-auto mb-4 text-cyan-500 animate-spin" />
                            <p className="text-lg mb-2">Đang tải câu hỏi...</p>
                          </div>
                        ) : questionsAnswers && questionsAnswers.length > 0 ? (
                          questionsAnswers.map((question: QuestionAssessment, index: number) => (
                            <div key={question.id} className="border border-slate-200 p-4 bg-slate-50/50">
                              {/* Question Header */}
                              <div className="flex items-start gap-3 mb-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 font-bold text-sm flex-shrink-0 mt-1">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-slate-800 leading-relaxed">
                                    {question.content}
                                  </h4>
                                </div>
                              </div>
                              
                              {/* Options */}
                              <div className="ml-11 space-y-2">
                                {question.options_assessments?.map((option: QuestionAssessment['options_assessments'][number], optIndex: number) => (
                                  <div 
                                    key={optIndex} 
                                    className={`flex items-center gap-3 p-3 border transition-all duration-200 ${
                                      option.correct 
                                        ? 'bg-green-50 border-green-200 text-green-800' 
                                        : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <div className={`flex items-center justify-center w-6 h-6 text-xs font-bold flex-shrink-0 ${
                                      option.correct 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      {String.fromCharCode(65 + optIndex)}
                                    </div>
                                    <span className="flex-1">{option.content}</span>
                                    {option.correct && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <span className="text-xs font-medium">Đúng</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-slate-500">
                            <FileQuestion className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-2">Chưa có câu hỏi nào</p>
                            <p className="text-sm">Hãy tạo câu hỏi đầu tiên cho bài test này</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-200 mt-8">
                  <Button
                    onClick={() => {
                      handleCloseDetailModal();
                      handleCreateQuestions(selectedAssessment.id);
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white px-6 py-2 font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm câu hỏi mới
                  </Button>
                  
                  <Button
                    onClick={handleCloseDetailModal}
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2 font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Đóng
                  </Button>
                </div>
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
                            onClick={() => handleViewDetail(assessment)}
                            className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">Xem chi tiết bài test</span>
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
