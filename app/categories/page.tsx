import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Laptop, 
  Briefcase, 
  Laugh, 
  GraduationCap, 
  Heart, 
  Newspaper, 
  Trophy, 
  Music, 
  Search, 
  Microscope, 
  Users,
  Mic,
  BookOpen,
  Gamepad2,
  Film,
  Palette
} from 'lucide-react'

export const metadata = {
  title: 'Categories - PodStream',
  description: 'Browse podcasts by category',
}

const CATEGORIES = [
  { value: 'technology', label: 'Technology', icon: Laptop, color: 'bg-blue-500/10 text-blue-600', description: 'Tech news, gadgets, and innovation' },
  { value: 'business', label: 'Business', icon: Briefcase, color: 'bg-emerald-500/10 text-emerald-600', description: 'Entrepreneurship and finance' },
  { value: 'comedy', label: 'Comedy', icon: Laugh, color: 'bg-yellow-500/10 text-yellow-600', description: 'Laughs and entertainment' },
  { value: 'education', label: 'Education', icon: GraduationCap, color: 'bg-indigo-500/10 text-indigo-600', description: 'Learn something new every day' },
  { value: 'health', label: 'Health & Fitness', icon: Heart, color: 'bg-red-500/10 text-red-600', description: 'Wellness and self-improvement' },
  { value: 'news', label: 'News', icon: Newspaper, color: 'bg-slate-500/10 text-slate-600', description: 'Stay informed with daily updates' },
  { value: 'sports', label: 'Sports', icon: Trophy, color: 'bg-orange-500/10 text-orange-600', description: 'Sports news and analysis' },
  { value: 'music', label: 'Music', icon: Music, color: 'bg-pink-500/10 text-pink-600', description: 'Music discussions and interviews' },
  { value: 'true-crime', label: 'True Crime', icon: Search, color: 'bg-purple-500/10 text-purple-600', description: 'Mysteries and investigations' },
  { value: 'science', label: 'Science', icon: Microscope, color: 'bg-cyan-500/10 text-cyan-600', description: 'Discoveries and research' },
  { value: 'society', label: 'Society & Culture', icon: Users, color: 'bg-teal-500/10 text-teal-600', description: 'Stories about people and culture' },
  { value: 'arts', label: 'Arts', icon: Palette, color: 'bg-rose-500/10 text-rose-600', description: 'Art, design, and creativity' },
  { value: 'fiction', label: 'Fiction', icon: BookOpen, color: 'bg-amber-500/10 text-amber-600', description: 'Stories and audio dramas' },
  { value: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'bg-violet-500/10 text-violet-600', description: 'Video games and esports' },
  { value: 'tv-film', label: 'TV & Film', icon: Film, color: 'bg-sky-500/10 text-sky-600', description: 'Movies and television shows' },
  { value: 'interview', label: 'Interviews', icon: Mic, color: 'bg-lime-500/10 text-lime-600', description: 'Conversations with interesting people' },
]

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Browse by Category</h1>
            <p className="mt-2 text-muted-foreground">
              Find podcasts that match your interests
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.value} href={`/browse?category=${category.value}`}>
                  <Card className="group h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${category.color} transition-transform group-hover:scale-110`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mb-1 font-semibold group-hover:text-primary">
                        {category.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
