import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import SEO from '../components/SEO';

export default function SearchPage() {
  const router = useRouter();
  const { q, category, sort, page } = router.query;
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const params = new URLSearchParams({
          q: q || '',
          category: category || 'all',
          sort: sort || 'createdAt-desc',
          page: page || '1',
        });

        const response = await fetch(`/api/search?${params}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [q, category, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get('search');
    router.push({
      pathname: '/search',
      query: { ...router.query, q: searchQuery, page: 1 },
    });
  };

  const handleFilterChange = (name, value) => {
    router.push({
      pathname: '/search',
      query: { ...router.query, [name]: value, page: 1 },
    });
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
  ];

  return (
    <>
      <SEO
        title="Search Results"
        description="Find the products you're looking for"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8">Search Results</h1>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <Input
                name="search"
                type="search"
                placeholder="Search products..."
                defaultValue={q}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </div>
          </form>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select
                  value={category || 'all'}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="games">Games</SelectItem>
                    <SelectItem value="subscriptions">Subscriptions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select
                  value={sort || 'createdAt-desc'}
                  onValueChange={(value) => handleFilterChange('sort', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1">
              {isLoading ? (
                <div className="text-center py-12">Loading...</div>
              ) : results?.products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    No products found matching your search criteria.
                  </p>
                  <Button onClick={() => router.push('/products')}>
                    Browse All Products
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results?.products.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product.slug}`}
                        className="group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:opacity-90 transition-opacity"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                          <div className="p-4">
                            <h2 className="text-lg font-semibold mb-2">
                              {product.name}
                            </h2>
                            <p className="text-primary font-bold">
                              ${product.price}
                            </p>
                            {product.stock <= 0 && (
                              <p className="text-red-500 text-sm">Out of Stock</p>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>

                  {results?.pagination.pages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                      {Array.from(
                        { length: results.pagination.pages },
                        (_, i) => i + 1
                      ).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={pageNum === parseInt(page) ? 'default' : 'outline'}
                          onClick={() =>
                            router.push({
                              pathname: '/search',
                              query: { ...router.query, page: pageNum },
                            })
                          }
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
} 