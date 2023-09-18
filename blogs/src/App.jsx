import './App.scss'
import { FrappeProvider } from 'frappe-react-sdk'
import Home from './pages/home'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import BlogPosts from './pages/blog-posts'
import BlogCategories from './pages/blog-categories'
import BlogPostsDraft from './pages/blog-posts-draft'
import BlogPostsPublished from './pages/blog-posts-published'
import Tags from './pages/tags'
import AddBlog from './pages/add-blog'
import EditBlog from './pages/edit-blog'
import ViewPost from './pages/view-post'
import Sidebar from './components/sidebar'
import { createContext } from 'react'

export const switchContext = createContext();

function App() {
  return (
    <>
      <FrappeProvider socketPort={import.meta.env.VITE_SOCKET_PORT ?? ''}>
        <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
          <switchContext.Provider>
            <Sidebar />
          </switchContext.Provider>
          <Routes>
            <Route path="/" element={<BlogPosts />}/>
            <Route path="/blog-posts" element={<BlogPosts />}/>
            <Route path='/blog-categories' element={<BlogCategories />}/>
            <Route path='/tags' element={<Tags />}/>
            <Route path='/blog-posts/draft' element={<BlogPostsDraft />} />
            <Route path='/blog-posts/published' element={<BlogPostsPublished />} />
            <Route path='/blog-posts/add' element={<AddBlog />} />
            <Route path='/blog-posts/edit/:id' element={<EditBlog />} />
            <Route path='/view-post/:id' element={<ViewPost />} />
          </Routes>
        </BrowserRouter>
      </FrappeProvider>
    </>
  )
}

export default App
