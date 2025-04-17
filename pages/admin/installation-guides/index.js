import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Link from 'next/link';
import { requireAdmin } from '@lib/auth';

export default function InstallationGuides() {
  const router = useRouter();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await fetch('/api/admin/installation-guides');
      if (!response.ok) {
        throw new Error('Failed to fetch guides');
      }
      const data = await response.json();
      // Ensure guides is always an array
      setGuides(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching guides:', error);
      toast({
        title: "Error",
        description: "Failed to fetch installation guides",
        variant: "destructive",
      });
      setGuides([]); // Set empty array on error
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guide?')) {
      try {
        const response = await fetch(`/api/admin/installation-guides/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete guide');
        }

        toast({
          title: "Success",
          description: "Installation guide deleted successfully",
        });
        fetchGuides();
      } catch (error) {
        console.error('Error deleting guide:', error);
        toast({
          title: "Error",
          description: "Failed to delete installation guide",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Installation Guides</h1>
        <Link href="/admin/installation-guides/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Guide
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          Loading...
        </div>
      ) : guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card key={guide._id}>
              <CardHeader>
                <CardTitle>{guide.productName}</CardTitle>
                <CardDescription>
                  Last updated: {new Date(guide.updatedAt || guide.lastUpdated).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  {guide.steps?.length || 0} steps • {guide.requirements?.length || 0} requirements
                </p>
                <div className="flex space-x-2">
                  <Link href={`/admin/installation-guides/${guide._id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(guide._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500 mb-4">No installation guides found</p>
            <Link href="/admin/installation-guides/new">
              <Button>Create your first guide</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const adminResult = await requireAdmin(context);
  
  if (adminResult && adminResult.redirect) {
    return adminResult;
  }

  return {
    props: {},
  };
}
