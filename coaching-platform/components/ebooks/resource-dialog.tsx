import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  BookOpen,
  Clock,
  Star,
  FileText,
  Eye,
  Download,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ebook: any; // Type can be improved based on your data structure
}

const ResourceDialog: React.FC<ResourceDialogProps> = ({ open, onOpenChange, ebook }) => {
  const [showPdf, setShowPdf] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!ebook) return null;

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        console.log("Dialog open state changed to:", open);
        onOpenChange(open);
        
        // When dialog opens, scroll to top of viewport
        if (open) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
    >
      <DialogContent className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isFullscreen ? 'max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh]' : 'max-w-6xl w-[95vw] max-h-[85vh]'} overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900 p-0 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl z-50`}>
        {/* Custom close button with higher z-index */}
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 z-[100]"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <DialogTitle className="sr-only">{ebook.title || 'Ebook Resource'}</DialogTitle>
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#245D66]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-[#245D66]/10 rounded-full filter blur-3xl"></div>
        
        {showPdf ? (
          <div className="relative w-full h-full">
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowPdf(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <iframe 
              src={currentPdfUrl} 
              className="w-full h-full min-h-[70vh]" 
              style={{ border: 'none' }} 
              title="PDF Viewer"
            />
          </div>
        ) : (
        <>
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="mb-2">
            <Badge className="bg-[#245D66]/20 text-[#245D66] hover:bg-[#245D66]/30 px-2 py-1 text-xs">
              {ebook.category}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {ebook.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Access your resource with options to view online or download
          </p>
          <span className="text-sm text-gray-600 dark:text-gray-300 mt-2">{ebook.author}</span>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Cover image */}
          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
            {ebook.thumbnail || ebook.coverImage ? (
              <Image
                src={ebook.thumbnail || ebook.coverImage}
                alt={ebook.title || 'Ebook cover image'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover bg-gray-900 transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 text-center">
                <BookOpen className="h-16 w-16 text-gray-500 hover:scale-110 transition-transform duration-300 mb-3" />
                <h4 className="text-[#245D66] text-sm font-medium line-clamp-2 bg-white/90 px-3 py-1 rounded transition-colors duration-300">
                  {ebook.productName || ebook.title}
                </h4>
              </div>
            )}
            
            {/* Overlay title for image */}
            {(ebook.thumbnail || ebook.coverImage) && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                <h4 className="text-white text-xs font-medium line-clamp-2">
                  {ebook.productName || ebook.title}
                </h4>
              </div>
            )}
          </div>
          
          {/* Right column: Description and PDFs */}
          <div className="md:col-span-2 space-y-6">
            <div id="resource-dialog-description">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {ebook.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Available Resources</h3>
              
              {/* Show product links if available */}
              {ebook.productlinks && ebook.productlinks.length > 0 ? (
                <div className="space-y-3">
                  {ebook.productlinks.map((link: string, index: number) => (
                    <div 
                      key={`link-${index}`} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-[#245D66]/10 p-2 rounded-lg">
                            <FileText className="h-6 w-6 text-[#245D66]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {ebook.productName || ebook.title} {ebook.productlinks.length > 1 ? `${index + 1}` : ''} PDF
                            </h4>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-[#245D66] text-[#245D66] hover:bg-[#245D66]/10 relative z-[90]"
                            onClick={() => window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(link)}&embedded=true`, '_blank')}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-[#245D66] hover:bg-[#1a474f] text-white"
                            onClick={() => window.open(link, '_blank')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Default PDF if no product links are defined */
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-[#245D66]/10 p-2 rounded-lg">
                        <FileText className="h-6 w-6 text-[#245D66]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{ebook.title}.pdf</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{ebook.pages} pages</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-[#245D66] text-[#245D66] hover:bg-[#245D66]/10 relative z-[90]"
                        onClick={() => {
                          const link = ebook.downloadLink || ebook.previewLink || '#';
                          setCurrentPdfUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(link)}&embedded=true`);
                          setShowPdf(true);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#245D66] hover:bg-[#1a474f] text-white"
                        onClick={() => window.open(ebook.downloadLink || '#', '_blank')}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Multiple PDFs if defined */}
              {ebook.pdfs && ebook.pdfs.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white">Additional Resources</h4>
                  {ebook.pdfs.map((pdf: any, index: number) => (
                    <div 
                      key={`pdf-${index}`} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-[#245D66]/10 p-2 rounded-lg">
                            <FileText className="h-6 w-6 text-[#245D66]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{pdf.name || `Part ${index + 1}`}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{pdf.pages || '—'} pages</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-[#245D66] text-[#245D66] hover:bg-[#245D66]/10 relative z-[90]"
                            onClick={() => {
                              const link = pdf.viewLink || pdf.previewLink || '#';
                              setCurrentPdfUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(link)}&embedded=true`);
                              setShowPdf(true);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-[#245D66] hover:bg-[#1a474f] text-white"
                            onClick={() => window.open(pdf.downloadLink || '#', '_blank')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {!showPdf && (
          <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
            {/* Close button removed */}
          </DialogFooter>
        )}
        </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDialog;
