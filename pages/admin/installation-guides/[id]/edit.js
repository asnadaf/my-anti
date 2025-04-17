import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '@components/SEO';
import { requireAdmin } from '@lib/auth';

export default function EditInstallationGuide() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    steps: [{ stepNumber: 1, title: '', description: '', imageUrl: '' }],
    requirements: [''],
    troubleshooting: [{ problem: '', solution: '' }],
    videoUrl: ''
  });

  useEffect(() => {
    if (id) {
      fetchGuide();
    }
  }, [id]);

  const fetchGuide = async () => {
    try {
      const response = await fetch(`/api/admin/installation-guides/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch guide');
      }
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError('Failed to fetch guide');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/installation-guides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update installation guide');
      }

      router.push('/admin/installation-guides');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, {
        stepNumber: formData.steps.length + 1,
        title: '',
        description: '',
        imageUrl: ''
      }]
    });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const addTroubleshooting = () => {
    setFormData({
      ...formData,
      troubleshooting: [...formData.troubleshooting, { problem: '', solution: '' }]
    });
  };

  return (
    <>
      <SEO title="Edit Installation Guide" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Installation Guide</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              />
            </div>

            {/* Installation Steps */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Installation Steps
                </label>
                <button
                  type="button"
                  onClick={addStep}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  + Add Step
                </button>
              </div>
              {formData.steps.map((step, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <h3 className="font-medium">Step {step.stepNumber}</h3>
                  <input
                    type="text"
                    placeholder="Step Title"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={step.title}
                    onChange={(e) => {
                      const newSteps = [...formData.steps];
                      newSteps[index].title = e.target.value;
                      setFormData({ ...formData, steps: newSteps });
                    }}
                  />
                  <textarea
                    placeholder="Step Description"
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                    value={step.description}
                    onChange={(e) => {
                      const newSteps = [...formData.steps];
                      newSteps[index].description = e.target.value;
                      setFormData({ ...formData, steps: newSteps });
                    }}
                  />
                  <input
                    type="url"
                    placeholder="Image URL (optional)"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={step.imageUrl}
                    onChange={(e) => {
                      const newSteps = [...formData.steps];
                      newSteps[index].imageUrl = e.target.value;
                      setFormData({ ...formData, steps: newSteps });
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  System Requirements
                </label>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  + Add Requirement
                </button>
              </div>
              {formData.requirements.map((req, index) => (
                <input
                  key={index}
                  type="text"
                  required
                  placeholder="e.g., Windows 10 or higher"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={req}
                  onChange={(e) => {
                    const newReqs = [...formData.requirements];
                    newReqs[index] = e.target.value;
                    setFormData({ ...formData, requirements: newReqs });
                  }}
                />
              ))}
            </div>

            {/* Troubleshooting */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Troubleshooting
                </label>
                <button
                  type="button"
                  onClick={addTroubleshooting}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  + Add Issue
                </button>
              </div>
              {formData.troubleshooting.map((issue, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <input
                    type="text"
                    placeholder="Problem"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={issue.problem}
                    onChange={(e) => {
                      const newIssues = [...formData.troubleshooting];
                      newIssues[index].problem = e.target.value;
                      setFormData({ ...formData, troubleshooting: newIssues });
                    }}
                  />
                  <textarea
                    placeholder="Solution"
                    required
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg"
                    value={issue.solution}
                    onChange={(e) => {
                      const newIssues = [...formData.troubleshooting];
                      newIssues[index].solution = e.target.value;
                      setFormData({ ...formData, troubleshooting: newIssues });
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Tutorial URL (optional)
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/installation-guides')}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Guide'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
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
