import { Link, useParams } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, CheckCircleIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { HomeSmile } from '@untitled-ui/icons-react/build/cjs';
import { useFrappeCreateDoc, useFrappeGetDoc, useFrappeGetDocList, useFrappeUpdateDoc } from "frappe-react-sdk";
import { Fragment, useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import LoadingCircle from "../components/loading";
import { useRef } from "react";
import { useCallback } from "react";

const EditBlog = () => {
  const { id } = useParams();

  const { data, isLoading, error, mutate } = useFrappeGetDoc('Blog Post', id, {
    fields: ['name', 'title', 'content', 'blog_category', 'published_on', 'blogger', 'published','_user_tags']
  })

  // console.log(data)

  const { data:dataCate } = useFrappeGetDocList('Blog Category', {
    fields: ['name', 'title']
  })

  const { data:dataBlogger } = useFrappeGetDocList('Blogger', {
    fields: ['name', 'full_name']
  })

  const { register, handleSubmit, watch, formState: {errors} } = useForm()

  const { updateDoc, loading } = useFrappeUpdateDoc()
  const { createDoc } = useFrappeCreateDoc();
  const { updateDoc:updatePublish, loading:loadingPublish } = useFrappeUpdateDoc()

  const [showSavePost, setShowSavePost] = useState(false);
  const [showError, setShowError] = useState(false);

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')

  const updatePost = (data) => {
    updateDoc('Blog Post', id, data)
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

  const addBlogCate = (data) => {
    createCate('Blog Category', data)
    .then(() => {
      mutate()
      setOpenAddCate(false);
      setShowAddNotification(true);
      setShowError(false);
      setTimeout(() => {
        setShowAddNotification(false)
      }, 10000)
    })
    .catch(() => {
      setOpenAddCate(false);
      setShowAddNotification(true);
      setShowError(true);
      setTimeout(() => {
        setShowAddNotification(false)
      }, 10000)
    })
  }

  const publishPost = (data) => {
    updatePublish('Blog Post', id, data)
  }

  useEffect(() => {
    if (data){
      mutate();
      setTitle(data.title);
      setDate(data.published_on);
    }
  })

  const [tagLists, setTagLists] = useState([]);
  const [tagName, setTagName] = useState('');

  const createTag = (info) => {
    createDoc('Tag', info);
    // console.log(info)
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
                  Edit Post
                </p>
              </div>
            </li>
          </ol>
        </nav>
        {data && (
          <>
            <form onSubmit={handleSubmit(updatePost)}>
              <div className="flex items-center justify-between mb-8">
                <h1 className="main-title">Edit Post: {data.title}</h1>
                <div className="flex gap-x-4">
                  <button
                    type='submit'
                    className="btn primary-btn"
                    {...register('published')}
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

              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <label htmlFor='title' className="subheading">Title</label>
                  <input type='text' id='title' name='title' defaultValue={title} className="form-input" {...register('title')} />
                </div>

                <div>
                  <label htmlFor='cate-title' className="subheading">Category</label>
                  {dataCate && (
                    <select value={dataCate.name} className="form-input" id='cate-title' name='blog_category' {...register('blog_category')}>
                      {dataCate.map((d) => 
                        <option key={d.name} value={d.name}>{d.title}</option>
                      )}
                    </select>
                  )}
                </div>
              </div>

              {/* <div className="mt-4">
                <label htmlFor='content' className="subheading">Content</label>
                <textarea id='content' name='content' className="form-input" defaultValue={data.content} style={{height:"200px"}} {...register('content')} />
              </div> */}

              <div className="grid grid-cols-2 gap-x-4 mt-4">
                <div>
                  <label htmlFor='published_on' className="subheading">Published on</label>
                  <input type='date' id='published_on' name='published_on' defaultValue={date} className="form-input" {...register('published_on')} />
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
            </form>

            <form onSubmit={handleSubmit(createTag)}>
              <div className="grid grid-cols-2 gap-x-4 mt-4">
                <div>
                  <label htmlFor='tag' className="subheading">Tag</label>
                  <div className="form-input-tag">
                    <ul className="inline-flex gap-2 flex-wrap" id='tag-lists'>
                      {tagLists.map((list, index) => 
                        <li key={list} className="bg-[#d1d5db] text-[#475467] px-2 inline-block rounded-lg flex items-center gap-x-1">
                          {list}
                  
                          <XMarkIcon width='20' onClick={() => tagLists.splice(index, 1)}/>
                        </li>
                      )}
                    </ul>
                    <input type='text' id='title' name='tag' value={tagName} className="outline-none w-full" {...register('name')} onChange={(e) => setTagName(e.target.value)} onKeyDown={(e) => {
                      if (e.key == "Enter"){
                        setTagLists(tagLists.concat(tagName));
                        setTagName('');
                        createTag(e.target.value);
                      }
                      if (e.key == "Backspace" && e.target.value.length == 0){
                        tagLists.pop();
                      }
                    }}/>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}

        {isLoading && (
          <LoadingCircle size={80} innerSize={70}/>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">There was an error loading the post, please try again.</h3>
              </div>
            </div>
          </div>
        )}
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
                        <p className="mt-1 text-sm text-gray-500">There has been an error updating the post, please try again.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">Post updated</p>
                        <p className="mt-1 text-sm text-gray-500">This post has been successfully updated.</p>
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

export default EditBlog;