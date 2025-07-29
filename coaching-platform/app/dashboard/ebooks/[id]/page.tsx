"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { collection, query as fsQuery, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/firebase/auth-context";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Star,
  FileText,
  Download,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Share2,
  Users
} from "lucide-react";

// Define the Ebook interface
interface Ebook {
  id: string | number;
  title: string;
  productName?: string;
  author?: string;
  coverImage?: string;
  thumbnail?: string;
  description?: string;
  pages?: number;
  category?: string;
  rating?: number;
  downloads?: number;
  readTime?: string;
  downloadLink?: string;
  featured?: boolean;
  new?: boolean;
  trending?: boolean;
  price?: number | null;
  enrolled?: boolean;
  includedInMembership?: boolean;
  isFree?: boolean;
  careerStage?: string;
  productlinks?: any[];
  selectedPdfUrl?: string; // Added to store the specific PDF URL selected by the user
}

export default function EbookPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useDirectEmbed, setUseDirectEmbed] = useState(false);
  const [googleViewerFailed, setGoogleViewerFailed] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [userOwnsEbook, setUserOwnsEbook] = useState(false);

  useEffect(() => {
    const fetchEbook = async () => {
      setLoading(true);
      
      // Try to load from sessionStorage first (populated by the dialog)
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('currentEbook');
        if (stored) {
          try {
            const parsed: Ebook = JSON.parse(stored);
            if (parsed && parsed.id?.toString() === params.id?.toString()) {
              console.log('Found ebook in sessionStorage:', parsed);
              setEbook(parsed);
              
              // Use the selectedPdfUrl if available, otherwise fall back to downloadLink
              if (parsed.selectedPdfUrl) {
                console.log('Using selected PDF URL:', parsed.selectedPdfUrl);
                setPdfUrl(parsed.selectedPdfUrl);
              } else {
                setPdfUrl(parsed.downloadLink || "");
              }
              
              setLoading(false);
              return; // Exit early if we found it in sessionStorage
            }
          } catch (e) {
            console.error('Failed to parse stored ebook', e);
          }
        }
      }
      
      try {
        const ebookId = params.id;
        
        // First try to fetch from Firestore
        const ebooksRef = collection(db, "ebooks");
        const q = fsQuery(ebooksRef, where("id", "==", ebookId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const ebookData = querySnapshot.docs[0].data() as Ebook;
          setEbook(ebookData);
          
          // Set PDF URL
          const link = ebookData.downloadLink || "";
          setPdfUrl(link);
          
          // Check if user owns this ebook
          if (user) {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              // Check products subcollection
              const productsRef = collection(userRef, "products");
              const productsQuery = fsQuery(productsRef, where("productId", "==", ebookId));
              const productsSnapshot = await getDocs(productsQuery);
              
              setUserOwnsEbook(!productsSnapshot.empty);
            }
          }
        } else {
          // If not found in Firestore, check static data (this would be replaced with your actual data source)
          // This is a fallback for demo purposes
          const mockEbooks = [
            {
              id: "1",
              title: "The Consultant's Playbook: Strategies for Success",
              author: "Dr. Sarah Mitchell",
              coverImage: "/images/ebooks/consultant-playbook.jpg",
              description: "A comprehensive guide to mastering the art of consulting with proven strategies from industry experts.",
              pages: 248,
              category: "Strategy",
              rating: 4.8,
              downloads: 12500,
              readTime: "8 hrs",
              downloadLink: "https://docs.google.com/document/d/1Rl76FnvHhgxKQbZJ0nQhprYRjuVVE2elFgSgYMptFB0/edit",
              price: 29.99,
              includedInMembership: true
            },
            {
              id: "2",
              title: "Case Interview Mastery: Frameworks and Techniques",
              author: "Michael Reynolds",
              coverImage: "/images/ebooks/case-interview.jpg",
              description: "Master the case interview process with structured frameworks and practical techniques for problem-solving.",
              pages: 186,
              category: "Interviews",
              rating: 4.9,
              downloads: 18200,
              readTime: "6 hrs",
              downloadLink: "https://docs.google.com/document/d/1Rl76FnvHhgxKQbZJ0nQhprYRjuVVE2elFgSgYMptFB0/edit",
              price: 24.99,
              includedInMembership: true
            }
          ];
          
          const foundEbook = mockEbooks.find(e => e.id.toString() === ebookId);
          if (foundEbook) {
            setEbook(foundEbook);
            setPdfUrl(foundEbook.downloadLink || "");
          } else {
            console.error("Ebook not found");
            router.push("/dashboard/ebooks");
          }
        }
      } catch (error) {
        console.error("Error fetching ebook:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEbook();
    }
  }, [params.id, user, router]);

  const handleGoBack = () => {
    router.back();
  };

  const handleDownload = () => {
    if (ebook?.downloadLink) {
      window.open(ebook.downloadLink, "_blank");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#245D66]"></div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Ebook not found</h1>
        <Button onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ebooks
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={handleGoBack} 
        className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Ebooks
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ebook details */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="relative aspect-square w-full max-w-xs mx-auto mb-6 overflow-hidden rounded-xl shadow-lg">
              {(ebook.thumbnail || ebook.coverImage) ? (
                <Image
                  src={ebook.thumbnail || ebook.coverImage || '/images/placeholder.jpg'}
                  alt={ebook.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover bg-gray-900 transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {ebook.new && (
                  <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                )}
                {ebook.trending && (
                  <Badge className="bg-orange-500 hover:bg-orange-600">Trending</Badge>
                )}
                {ebook.featured && (
                  <Badge className="bg-purple-500 hover:bg-purple-600">Featured</Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{ebook.title}</h1>
              
              {ebook.author && (
                <p className="text-gray-600 dark:text-gray-400">
                  By {ebook.author}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3">
                {ebook.category && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {ebook.category}
                  </Badge>
                )}
                
                {ebook.readTime && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ebook.readTime}
                  </Badge>
                )}
                
                {ebook.rating && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {ebook.rating}
                  </Badge>
                )}
                
                {ebook.downloads && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {ebook.downloads.toLocaleString()}
                  </Badge>
                )}
              </div>
              
              {ebook.description && (
                <p className="text-gray-700 dark:text-gray-300">
                  {ebook.description}
                </p>
              )}
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-[#245D66] text-[#245D66] hover:bg-[#245D66]/10"
                  onClick={() => window.open(`/dashboard/ebooks/${params.id}`, "_blank")}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className={`lg:col-span-2 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4' : ''}`}>
          <div className="relative h-full">
            {/* Fullscreen toggle */}
            <div className="absolute top-2 right-2 z-10">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* PDF Embed */}
            <div className={`w-full ${isFullscreen ? 'h-[calc(100vh-32px)]' : 'h-[80vh]'} rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg`}>
              {pdfUrl ? (
                <>
                  {!useDirectEmbed ? (
                    <div className="relative w-full h-full">
                      <iframe 
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
                        className="w-full h-full"
                        frameBorder="0"
                        title={ebook.title}
                        onError={() => {
                          console.log('Google Docs viewer failed, switching to direct embed');
                          setGoogleViewerFailed(true);
                          setUseDirectEmbed(true);
                        }}
                      />
                      {googleViewerFailed && (
                        <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
                          <p className="mb-4 text-center">Google Docs viewer is having trouble loading this PDF.</p>
                          <Button 
                            onClick={() => setUseDirectEmbed(true)}
                            className="bg-[#245D66] hover:bg-[#1a474f] text-white"
                          >
                            Try Direct PDF Embed
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <object
                      data={pdfUrl}
                      type="application/pdf"
                      className="w-full h-full"
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Unable to display PDF directly.</p>
                        <Button 
                          onClick={() => window.open(pdfUrl, '_blank')}
                          className="bg-[#245D66] hover:bg-[#1a474f] text-white"
                        >
                          Open PDF in New Tab
                        </Button>
                        <Button 
                          onClick={() => setUseDirectEmbed(false)}
                          variant="outline"
                          className="mt-2 border-[#245D66] text-[#245D66] hover:bg-[#245D66]/10"
                        >
                          Try Google Viewer Again
                        </Button>
                      </div>
                    </object>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">PDF not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
