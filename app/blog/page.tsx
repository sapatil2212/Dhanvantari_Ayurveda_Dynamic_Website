import { Metadata } from 'next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, Leaf, Heart, Brain } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ayurveda Blog | Health Tips & Wellness Articles | Dhanvantari Clinic',
  description: 'Explore our comprehensive collection of Ayurvedic health articles, wellness tips, and traditional healing insights from experienced practitioners.',
};

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Your Ayurvedic Constitution (Prakriti)',
    excerpt: 'Discover how knowing your unique dosha combination can help you make better lifestyle and health choices.',
    category: 'Fundamentals',
    readTime: '8 min read',
    publishDate: '2024-01-15',
    image: 'https://images.pexels.com/photos/4498318/pexels-photo-4498318.jpeg?auto=compress&cs=tinysrgb&w=600',
    icon: <Leaf className="w-5 h-5" />,
    tags: ['Prakriti', 'Doshas', 'Constitution']
  },
  {
    id: 2,
    title: 'Panchkarma: The Complete Detoxification Guide',
    excerpt: 'Learn about the five traditional cleansing therapies and how they can restore your natural balance.',
    category: 'Treatments',
    readTime: '12 min read',
    publishDate: '2024-01-10',
    image: 'https://images.pexels.com/photos/3985169/pexels-photo-3985169.jpeg?auto=compress&cs=tinysrgb&w=600',
    icon: <Heart className="w-5 h-5" />,
    tags: ['Panchkarma', 'Detox', 'Therapy']
  },
  {
    id: 3,
    title: 'Ayurvedic Diet: Eating According to Your Dosha',
    excerpt: 'Understand how different foods affect your doshas and learn to create a personalized nutrition plan.',
    category: 'Nutrition',
    readTime: '10 min read',
    publishDate: '2024-01-05',
    image: 'https://images.pexels.com/photos/4113950/pexels-photo-4113950.jpeg?auto=compress&cs=tinysrgb&w=600',
    icon: <Leaf className="w-5 h-5" />,
    tags: ['Diet', 'Nutrition', 'Lifestyle']
  },
  {
    id: 4,
    title: 'Managing Stress with Ayurvedic Practices',
    excerpt: 'Explore ancient techniques like meditation, pranayama, and yoga to combat modern stress effectively.',
    category: 'Mental Health',
    readTime: '7 min read',
    publishDate: '2023-12-28',
    image: 'https://images.pexels.com/photos/4498321/pexels-photo-4498321.jpeg?auto=compress&cs=tinysrgb&w=600',
    icon: <Brain className="w-5 h-5" />,
    tags: ['Stress', 'Meditation', 'Mental Health']
  },
  {
    id: 5,
    title: 'Seasonal Wellness: Ayurvedic Tips for Winter Health',
    excerpt: 'Learn how to adapt your diet, lifestyle, and self-care routine for optimal health during winter months.',
    category: 'Seasonal Health',
    readTime: '9 min read',
    publishDate: '2023-12-20',
    image: 'https://images.pexels.com/photos/4498315/pexels-photo-4498315.jpeg?auto=compress&cs=tinysrgb&w=600',
    icon: <Leaf className="w-5 h-5" />,
    tags: ['Seasonal', 'Winter', 'Wellness']
  },
  {
    id: 6,
    title: 'Home Remedies for Common Digestive Issues',
    excerpt: 'Discover simple Ayurvedic remedies using kitchen herbs and spices to improve your digestive health.',
    category: 'Home Remedies',
    readTime: '6 min read',
    publishDate: '2023-12-15',
    image: 'https://images.pexels.com/photos/4498310/pexels-photo-4498310.jpeg?auto=compress&cs=tinysrgb&w=600',
    icon: <Heart className="w-5 h-5" />,
    tags: ['Digestion', 'Home Remedies', 'Herbs']
  }
];

const categories = ['All', 'Fundamentals', 'Treatments', 'Nutrition', 'Mental Health', 'Seasonal Health', 'Home Remedies'];

export default function BlogPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
            Ayurveda Blog & Wellness Articles
          </h1>
          <p className="text-lg text-emerald-600 mb-8">
            Discover ancient wisdom for modern living through our comprehensive health guides
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.slice(1).map((category) => (
              <Badge key={category} variant="outline" className="border-emerald-200 text-emerald-700">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">Featured Article</h2>
            <div className="w-20 h-1 bg-emerald-600"></div>
          </div>
          
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-emerald-200">
            <div className="grid md:grid-cols-2 gap-0">
              <div 
                className="h-64 md:h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${blogPosts[0].image})` }}
              />
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    {blogPosts[0].icon}
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    {blogPosts[0].category}
                  </Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">
                  {blogPosts[0].title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(blogPosts[0].publishDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                  
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Read More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Articles Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">Latest Articles</h2>
            <div className="w-20 h-1 bg-emerald-600"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-emerald-100">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.image})` }}
                />
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                      {post.category}
                    </Badge>
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      {post.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-emerald-800 line-clamp-2">
                    {post.title}
                  </h3>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(post.publishDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                    Read Article <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-emerald-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Wellness Tips</h2>
          <p className="text-emerald-100 mb-8">
            Subscribe to our newsletter for the latest Ayurvedic health insights and seasonal wellness tips
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-gray-800"
            />
            <Button className="bg-white text-emerald-800 hover:bg-emerald-50 px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 px-4 bg-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">Explore Topics</h2>
            <p className="text-emerald-600">Find articles that match your interests</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Ayurvedic Fundamentals',
                description: 'Learn the basic principles of Ayurveda, doshas, and constitution',
                count: '12 articles',
                color: 'bg-blue-100 text-blue-800'
              },
              {
                title: 'Treatment Guides',
                description: 'Comprehensive guides on Panchkarma and therapeutic treatments',
                count: '8 articles',
                color: 'bg-green-100 text-green-800'
              },
              {
                title: 'Lifestyle & Nutrition',
                description: 'Practical tips for incorporating Ayurveda into daily life',
                count: '15 articles',
                color: 'bg-yellow-100 text-yellow-800'
              }
            ].map((topic, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-0 text-center">
                  <div className={`w-12 h-12 rounded-full ${topic.color} flex items-center justify-center mx-auto mb-4`}>
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">{topic.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                    {topic.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}