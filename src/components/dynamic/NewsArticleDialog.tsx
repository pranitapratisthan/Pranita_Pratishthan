
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Calendar, User } from "lucide-react";

interface NewsArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news?: {
    title: string;
    summary?: string;
    content: string;
    author?: string;
    date?: string;
  };
}

const NewsArticleDialog: React.FC<NewsArticleDialogProps> = ({ open, onOpenChange, news }) => {
  if (!news) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-marathi-orange text-2xl mb-2 pr-8">{news.title}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
              {news.author && (
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {news.author}
                </span>
              )}
              {news.date && (
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(news.date).toLocaleDateString('mr-IN')}
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        {news.summary && (
          <div className="text-gray-700 mt-2 mb-2 font-semibold">{news.summary}</div>
        )}
        <div className="prose text-gray-800 max-w-none mt-2 whitespace-pre-wrap">{news.content}</div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsArticleDialog;
