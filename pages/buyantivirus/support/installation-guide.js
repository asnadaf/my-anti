import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function InstallationGuidePage() {
  const router = useRouter();
  const { productId } = router.query;
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      fetchGuide();
    }
  }, [productId]);

  const fetchGuide = async () => {
    try {
      const response = await fetch(`/api/installation-guides/${productId}`);
      if (!response.ok) {
        throw new Error('Guide not found');
      }
      const data = await response.json();
      setGuide(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load installation guide');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!guide) {
    return <div className="container mx-auto p-6">Guide not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{guide.productName} Installation Guide</h1>

      {/* System Requirements */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>System Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6">
            {guide.requirements.map((req, index) => (
              <li key={index} className="text-gray-600">{req}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Installation Steps */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Installation Steps</h2>
        <div className="space-y-4">
          {guide.steps.map((step) => (
            <Card key={step.stepNumber}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    {step.stepNumber}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    {step.imageUrl && (
                      <div className="relative h-48 w-full md:w-2/3 lg:w-1/2">
                        <Image
                          src={step.imageUrl}
                          alt={step.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Tutorial */}
      {guide.videoUrl && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Video Tutorial</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={guide.videoUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Troubleshooting */}
      {guide.troubleshooting.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
          <Accordion type="single" collapsible>
            {guide.troubleshooting.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.problem}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{item.solution}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
