import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen, MessageSquare, FileText, Search } from 'lucide-react';

const defaultGuides = [
  {
    _id: 'norton',
    productName: "Norton Antivirus",
    description: "Complete installation guide for Norton Antivirus",
    steps: [
      { title: "Download Setup", description: "Download Norton installer" },
      { title: "Run Installation", description: "Double click setup file" }
    ],
    requirements: ["Windows 10", "2GB RAM", "1GB Space"]
  },
  {
    _id: 'mcafee',
    productName: "McAfee Total Protection",
    description: "Step-by-step McAfee installation guide",
    steps: [
      { title: "Get Started", description: "Download McAfee installer" },
      { title: "Install", description: "Follow installation wizard" }
    ],
    requirements: ["Windows 8/10/11", "4GB RAM", "2GB Space"]
  },
  {
    _id: 'kaspersky',
    productName: "Kaspersky Internet Security",
    description: "Installation instructions for Kaspersky",
    steps: [
      { title: "Preparation", description: "Download Kaspersky setup" },
      { title: "Setup", description: "Run the installer" }
    ],
    requirements: ["Windows 7/8/10", "2GB RAM", "1.5GB Space"]
  }
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("installation");
  const [searchQuery, setSearchQuery] = useState("");
  const [guides, setGuides] = useState(defaultGuides);
  const [filteredGuides, setFilteredGuides] = useState(defaultGuides);

  useEffect(() => {
    // Filter guides based on search query
    const filtered = guides.filter(guide => 
      guide.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGuides(filtered);
  }, [searchQuery, guides]);

  const supportSections = {
    installation: {
      title: "Installation Guides",
      icon: <BookOpen className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search installation guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Link key={guide._id} href={`/buyantivirus/support/installation-guide?productId=${guide._id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{guide.productName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">{guide.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{guide.steps.length} steps</span>
                      <span className="mx-2">•</span>
                      <span>{guide.requirements.length} requirements</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )
    },
    faq: {
      title: "Frequently Asked Questions",
      icon: <HelpCircle className="h-6 w-6" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Common questions about our services</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Technical Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Technical issues and solutions</p>
            </CardContent>
          </Card>
        </div>
      )
    },
    contact: {
      title: "Contact Support",
      icon: <MessageSquare className="h-6 w-6" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Get help via email</p>
              <Button className="mt-4">Contact Us</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Chat with our support team</p>
              <Button className="mt-4">Start Chat</Button>
            </CardContent>
          </Card>
        </div>
      )
    },
    documentation: {
      title: "Documentation",
      icon: <FileText className="h-6 w-6" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Detailed product documentation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Common issues and solutions</p>
            </CardContent>
          </Card>
        </div>
      )
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Support Center</h1>
      
      <Tabs defaultValue="installation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(supportSections).map(([key, section]) => (
            <TabsTrigger 
              key={key} 
              value={key}
              className="flex items-center gap-2"
              onClick={() => setActiveTab(key)}
            >
              {section.icon}
              <span className="hidden md:inline">{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(supportSections).map(([key, section]) => (
          <TabsContent key={key} value={key}>
            {section.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
