import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const AIModal = ({ open, onOpenChange, title, generateContent, onApply }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open) {
      setLoading(true);
      setContent('');
      
      // Handle async content generation
      const loadContent = async () => {
        try {
          const result = await generateContent();
          setContent(result);
        } catch (error) {
          console.error('Failed to generate content:', error);
          setContent('İçerik oluşturulamadı. Lütfen tekrar deneyin.');
        } finally {
          setLoading(false);
        }
      };
      
      loadContent();
    }
  }, [open, generateContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Panoya kopyalandı');
  };

  const handleApply = () => {
    if (onApply) {
      onApply(content);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            AI tarafından oluşturulan içerik aşağıda gösterilmektedir.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">AI içerik oluşturuyor...</span>
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="whitespace-pre-line text-sm leading-relaxed">{content}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} aria-label="İptal">
            İptal
          </Button>
          {!loading && (
            <>
              <Button variant="outline" onClick={handleCopy} aria-label="Kopyala">
                <Copy className="mr-2 h-4 w-4" />
                Kopyala
              </Button>
              {onApply && (
                <Button onClick={handleApply} aria-label="Uygula">
                  Uygula
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
