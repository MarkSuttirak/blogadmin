import { Link } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, CheckCircleIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { HomeSmile } from '@untitled-ui/icons-react/build/cjs';
import { useFrappeCreateDoc, useFrappeGetDocList, useFrappeFileUpload } from "frappe-react-sdk";
import { Fragment, useState, useEffect } from "react";
import { useForm } from 'react-hook-form';

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'



const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

const content = "<h2></h2>";




const AddBlog = () => {
  const { data:dataCate } = useFrappeGetDocList('Blog Category', {
    fields: ['name', 'title']
  })

  const { data:dataBlogger } = useFrappeGetDocList('Blogger', {
    fields: ['name', 'full_name']
  })

  const { register, handleSubmit, formState: {errors} } = useForm()

  const { createDoc, loading } = useFrappeCreateDoc()
  const { createDoc:createPublish, loading:loadingPublish } = useFrappeCreateDoc()

  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [showSavePost, setShowSavePost] = useState(false);
  const [showError, setShowError] = useState(false);
  const [postcontent, Setpostcontent] = useState();

  const { upload, progress, loading:loadingUpload, error:errorUpload } = useFrappeFileUpload()

  const fileArgs = {
    "isPrivate": false,
    "doctype": "Blog Post",
    "fieldname": "meta_image"
  }

  const [fileImg, setFileImg] = useState();
  const [uploaded, setUploaded] = useState()

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null
  }

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        redo
      </button>
      <button
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
      >
        purple
      </button>
    </>
  )
}

  const createPost = (data) => {

    data.content_html = postcontent;

    createDoc('Blog Post', {
      ...data,
      meta_image: uploaded
    })
    .then(() => {
      setShowSavePost(true);
      setShowError(false)
    }).catch(() => {
      setShowSavePost(true);
      setShowError(true)
      setTimeout(() => {
        setShowSavePost(false)
      }, 10000)
    })
  }

  const publishPost = (data) => {
    createPublish('Blog Post', id, {
      ...data,
      meta_image: uploaded,
      published: 1,
    })
    .then(() => {
      setShowSavePost(true);
      setShowError(false);
      setIsPublishing(false);
      setIsPublished(true);
    }).catch(() => {
      setShowSavePost(true);
      setShowError(true)
      setIsPublishing(false);
      setTimeout(() => {
        setShowSavePost(false)
      }, 10000)
    })
  }

  return (
    <>
      <div className='page-section'>
        <nav className="flex mb-5" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <Link to='/' className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  <HomeSmile />
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <Link to='/blog-posts' className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Blog Posts
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <p className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Add Post
                </p>
              </div>
            </li>
          </ol>
        </nav>
        <form onSubmit={isPublishing ? handleSubmit(publishPost) : handleSubmit(createPost)}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="main-title">Add Post</h1>
            <div className="flex gap-x-4">
              <button
                onClick={() => setIsPublishing(true)}
                className="btn secondary-btn"
              >
                {loadingPublish ? 'Publishing...' : 'Publish'}
              </button>
              <button
                type='submit'
                className="btn primary-btn"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor='image' className="subheading inline-block cursor-pointer">
              Blog image
              <div className={`w-[180px] h-[120px]${!uploaded ? ' bg-[#737373] ' : ' '}rounded-lg overflow-hidden`}>
                {uploaded && <img src={fileImg} className="w-full h-full object-cover"/>}
                <input type='file' id='image' name='meta_image' className='hidden' accept='image/png, image/svg, image/jpg, image/jpeg' {...register('meta_image')} onChange={(e) => {
                  setFileImg(URL.createObjectURL(e.target.files[0]))
                  upload(e.target.files[0], fileArgs)
                  .then((res) => setUploaded(res.file_url))
                  .then(() => console.log("Upload completed"))
                  .catch((e) => console.error(e))
                }} multiple="false"/>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-x-4 mt-4">
            <div>
              <label htmlFor='title' className="subheading">Title</label>
              <input type='text' id='title' name='title' className="form-input" {...register('title')}/>
            </div>

            <div>
              <label htmlFor='cate-title' className="subheading">Category</label>
              {dataCate && (
                <select className="form-input" id='cate-title' name='blog_category' {...register('blog_category')} defaultValue={dataCate.name}>
                  {dataCate.map((d) => 
                    <option value={d.name}>{d.title}</option>
                  )}
                </select>
              )}
            </div>
          </div>

          <div className="mt-4 editorsection">
            
            <EditorProvider  onUpdate={({ editor }) => Setpostcontent(editor.getHTML())} slotBefore={<MenuBar />} extensions={extensions} content={content}></EditorProvider>
          </div> 

          <div className="grid grid-cols-2 gap-x-4 mt-4">
            <div>
              <label htmlFor='published_on' className="subheading">Published on</label>
              <input type='date' id='published_on' name='published_on' className="form-input" {...register('published_on')}/>
            </div>

            <div>
              <label htmlFor='blogger' className="subheading">Blogger</label>
              {dataBlogger && (
                <select className="form-input" id='blogger' name='blogger' {...register('blogger')} defaultValue={dataBlogger.name}>
                  {dataBlogger.map((d) => 
                    <option value={d.name}>{d.name}</option>
                  )}
                </select>
              )}
            </div>
          </div>

          {/* <div className="mt-4">
            <label htmlFor='published_on' className="subheading">Attach Image</label><br/>
            <input type='file' {...register('meta_image')}/>
          </div> */}
        </form>
      </div>

      {/* A notification when creating a post */}

      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[999]"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={showSavePost}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  {showError ? (
                    <>
                      <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">An error occurred</p>
                        <p className="mt-1 text-sm text-gray-500">There has been an error creating the post, please try again.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">Post created</p>
                        <p className="mt-1 text-sm text-gray-500">A post has been successfully created.</p>
                      </div>
                    </>
                  )}
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShowSavePost(false)
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}



export default AddBlog;