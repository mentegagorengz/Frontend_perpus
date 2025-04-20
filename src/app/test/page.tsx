"use client"

import { useState } from "react"
import { BookIcon, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

// Book type definition based on the provided fields
interface BookType {
  id: string
  title: string
  isbn: string
  edition: string
  language: string
  publisher: string
  description: string
  classificationNumber: string
  category: string
  mainAuthor: string
  additionalAuthors: string[]
  subject: string[]
  bibliography: string
  generalNotes: string
  digitalContent: string
  condition: string
  location: string
  availability: "Available" | "Borrowed" | "Reserved"
  coverImage: string
}

// Sample book data
const sampleBooks: BookType[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    isbn: "9780743273565",
    edition: "First Edition",
    language: "English",
    publisher: "Scribner",
    description:
      "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    classificationNumber: "813.52",
    category: "Fiction",
    mainAuthor: "F. Scott Fitzgerald",
    additionalAuthors: [],
    subject: ["American Literature", "Jazz Age", "Wealth"],
    bibliography: "Includes bibliographical references (p. 180-182) and index.",
    generalNotes: "This edition includes a new introduction by the publisher.",
    digitalContent: "E-book available",
    condition: "Good",
    location: "Main Library - Fiction Section",
    availability: "Available",
    coverImage: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    isbn: "9780061120084",
    edition: "50th Anniversary Edition",
    language: "English",
    publisher: "Harper Perennial Modern Classics",
    description:
      "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. 'To Kill A Mockingbird' became both an instant bestseller and a critical success when it was first published in 1960.",
    classificationNumber: "813.54",
    category: "Fiction",
    mainAuthor: "Harper Lee",
    additionalAuthors: [],
    subject: ["Legal Stories", "Race Relations", "Southern States"],
    bibliography: "Includes critical essays and reviews.",
    generalNotes: "Pulitzer Prize winner, 1961",
    digitalContent: "Audiobook available",
    condition: "Excellent",
    location: "Main Library - Fiction Section",
    availability: "Borrowed",
    coverImage: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "3",
    title: "1984",
    isbn: "9780451524935",
    edition: "Signet Classic Edition",
    language: "English",
    publisher: "Signet Classic",
    description:
      "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
    classificationNumber: "823.912",
    category: "Fiction",
    mainAuthor: "George Orwell",
    additionalAuthors: [],
    subject: ["Dystopian Fiction", "Totalitarianism", "Political Fiction"],
    bibliography: "Includes afterword by Erich Fromm.",
    generalNotes: "Originally published in 1949",
    digitalContent: "E-book and audiobook available",
    condition: "Fair",
    location: "Main Library - Science Fiction Section",
    availability: "Available",
    coverImage: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "4",
    title: "The Hobbit",
    isbn: "9780547928227",
    edition: "75th Anniversary Edition",
    language: "English",
    publisher: "Houghton Mifflin Harcourt",
    description:
      "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep.",
    classificationNumber: "823.912",
    category: "Fantasy",
    mainAuthor: "J.R.R. Tolkien",
    additionalAuthors: [],
    subject: ["Fantasy Fiction", "Middle Earth", "Adventure"],
    bibliography: "Includes maps and illustrations by the author.",
    generalNotes: "Prequel to The Lord of the Rings trilogy",
    digitalContent: "E-book available",
    condition: "Good",
    location: "Main Library - Fantasy Section",
    availability: "Reserved",
    coverImage: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    isbn: "9780141439518",
    edition: "Penguin Classics Edition",
    language: "English",
    publisher: "Penguin Classics",
    description:
      "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language.",
    classificationNumber: "823.7",
    category: "Fiction",
    mainAuthor: "Jane Austen",
    additionalAuthors: [],
    subject: ["Romance", "Social Criticism", "19th Century"],
    bibliography: "Includes introduction by Tony Tanner.",
    generalNotes: "Originally published in 1813",
    digitalContent: "E-book and audiobook available",
    condition: "Excellent",
    location: "Main Library - Classics Section",
    availability: "Available",
    coverImage: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "6",
    title: "The Catcher in the Rye",
    isbn: "9780316769488",
    edition: "Little, Brown and Company Edition",
    language: "English",
    publisher: "Little, Brown and Company",
    description:
      "The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield. Through circumstances that tend to preclude adult, secondhand description, he leaves his prep school in Pennsylvania and goes underground in New York City for three days.",
    classificationNumber: "813.54",
    category: "Fiction",
    mainAuthor: "J.D. Salinger",
    additionalAuthors: [],
    subject: ["Coming of Age", "Alienation", "Adolescence"],
    bibliography: "No bibliography included.",
    generalNotes: "First published in 1951",
    digitalContent: "E-book available",
    condition: "Good",
    location: "Main Library - Fiction Section",
    availability: "Borrowed",
    coverImage: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "7",
    title: "Harry Potter and the Philosopher's Stone",
    isbn: "9780747532743",
    edition: "First Edition",
    language: "English",
    publisher: "Bloomsbury",
    description:
      "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle.",
    classificationNumber: "823.914",
    category: "Fantasy",
    mainAuthor: "J.K. Rowling",
    additionalAuthors: [],
    subject: ["Fantasy Fiction", "Magic", "Wizards"],
    bibliography: "No bibliography included.",
    generalNotes: "First book in the Harry Potter series",
    digitalContent: "E-book and audiobook available",
    condition: "Excellent",
    location: "Main Library - Fantasy Section",
    availability: "Available",
    coverImage: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "8",
    title: "The Lord of the Rings",
    isbn: "9780618640157",
    edition: "50th Anniversary Edition",
    language: "English",
    publisher: "Houghton Mifflin Harcourt",
    description:
      "In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, the Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others.",
    classificationNumber: "823.912",
    category: "Fantasy",
    mainAuthor: "J.R.R. Tolkien",
    additionalAuthors: [],
    subject: ["Fantasy Fiction", "Middle Earth", "Epic"],
    bibliography: "Includes maps and appendices by the author.",
    generalNotes: "Complete one-volume edition",
    digitalContent: "E-book available",
    condition: "Good",
    location: "Main Library - Fantasy Section",
    availability: "Reserved",
    coverImage: "/placeholder.svg?height=400&width=300",
  },
]

export default function BookCollection() {
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewType, setViewType] = useState("grid")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterAvailability, setFilterAvailability] = useState("all")

  // Filter books based on search term and filters
  const filteredBooks = sampleBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.mainAuthor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === "all" || book.category === filterCategory

    const matchesAvailability = filterAvailability === "all" || book.availability === filterAvailability

    return matchesSearch && matchesCategory && matchesAvailability
  })

  // Open book details dialog
  const openBookDetails = (book: BookType) => {
    setSelectedBook(book)
    setIsDialogOpen(true)
  }

  // Get availability badge color
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-500"
      case "Borrowed":
        return "bg-red-500"
      case "Reserved":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <BookIcon className="mr-2 h-8 w-8" />
          Book Collection
        </h1>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or author..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Fiction">Fiction</SelectItem>
                <SelectItem value="Fantasy">Fantasy</SelectItem>
                <SelectItem value="Non-fiction">Non-fiction</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAvailability} onValueChange={setFilterAvailability}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Borrowed">Borrowed</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={() => setViewType(viewType === "grid" ? "list" : "grid")}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* View type tabs */}
        <Tabs defaultValue={viewType} value={viewType} onValueChange={setViewType}>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Book collection display */}
      <main>
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found matching your search criteria.</p>
          </div>
        ) : viewType === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden h-full flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative h-[200px] w-full">
                    <img
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge className={`absolute top-2 right-2 ${getAvailabilityColor(book.availability)}`}>
                      {book.availability}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex-grow">
                  <h3 className="line-clamp-2 mb-2 font-bold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {book.mainAuthor}</p>
                  <p className="text-sm line-clamp-3 text-muted-foreground">{book.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => openBookDetails(book)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map((book) => (
              <div key={book.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                <div className="sm:w-[100px] flex-shrink-0">
                  <img
                    src={book.coverImage || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-[150px] object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">by {book.mainAuthor}</p>
                    </div>
                    <Badge className={getAvailabilityColor(book.availability)}>{book.availability}</Badge>
                  </div>
                  <p className="text-sm line-clamp-2 my-2 text-muted-foreground">{book.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">{book.category}</Badge>
                    <Badge variant="outline">{book.language}</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => openBookDetails(book)}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Book details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedBook.title}</DialogTitle>
                <DialogDescription>by {selectedBook.mainAuthor}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="col-span-1">
                  <div className="relative">
                    <img
                      src={selectedBook.coverImage || "/placeholder.svg"}
                      alt={selectedBook.title}
                      className="w-full rounded-lg"
                    />
                    <Badge className={`absolute top-2 right-2 ${getAvailabilityColor(selectedBook.availability)}`}>
                      {selectedBook.availability}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div>
                      <h4 className="text-sm font-semibold">ISBN</h4>
                      <p className="text-sm">{selectedBook.isbn}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Edition</h4>
                      <p className="text-sm">{selectedBook.edition}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Publisher</h4>
                      <p className="text-sm">{selectedBook.publisher}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Language</h4>
                      <p className="text-sm">{selectedBook.language}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Classification Number</h4>
                      <p className="text-sm">{selectedBook.classificationNumber}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Category</h4>
                      <p className="text-sm">{selectedBook.category}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-sm">{selectedBook.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold">Main Author</h4>
                      <p className="text-sm">{selectedBook.mainAuthor}</p>
                    </div>

                    {selectedBook.additionalAuthors.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold">Additional Authors</h4>
                        <p className="text-sm">{selectedBook.additionalAuthors.join(", ")}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold">Subject</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedBook.subject.map((subject, index) => (
                          <Badge key={index} variant="outline">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold">Bibliography</h4>
                      <p className="text-sm">{selectedBook.bibliography}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold">General Notes</h4>
                      <p className="text-sm">{selectedBook.generalNotes}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold">Digital Content</h4>
                      <p className="text-sm">{selectedBook.digitalContent}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold">Condition</h4>
                      <p className="text-sm">{selectedBook.condition}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold">Location</h4>
                      <p className="text-sm">{selectedBook.location}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-2">Availability</h3>
                    <div className="flex items-center">
                      <Badge className={`mr-2 ${getAvailabilityColor(selectedBook.availability)}`}>
                        {selectedBook.availability}
                      </Badge>
                      {selectedBook.availability === "Available" ? (
                        <p className="text-sm text-green-600">This book is available for borrowing</p>
                      ) : selectedBook.availability === "Borrowed" ? (
                        <p className="text-sm text-red-600">This book is currently borrowed</p>
                      ) : (
                        <p className="text-sm text-yellow-600">This book is reserved</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

