import { Link } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, CheckCircleIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { HomeSmile } from '@untitled-ui/icons-react/build/cjs';
import { useFrappeCreateDoc, useFrappeGetDocList, useFrappeFileUpload } from "frappe-react-sdk";
import { Fragment, useState } from "react";
import { useForm } from 'react-hook-form'
import EditorJs from '@natterstefan/react-editor-js'
import { EDITOR_JS_TOOLS } from '../components/constants'

const AddBlog = () => {
  let editor = null
  const { data:dataCate } = useFrappeGetDocList('Blog Category', {
    fields: ['name', 'title']
  })

  const { data:dataBlogger } = useFrappeGetDocList('Blogger', {
    fields: ['name', 'full_name']
  })

  const { upload } = useFrappeFileUpload();

  const { register, handleSubmit, formState: {errors} } = useForm()

  const { createDoc, loading } = useFrappeCreateDoc()
  const { createDoc:createPublish, loading:loadingPublish } = useFrappeCreateDoc()

  const [showSavePost, setShowSavePost] = useState(false);
  const [showError, setShowError] = useState(false);

  const onChange = () => {
    console.log(editor.save())
  }
  const onSave = async () => {
    try {
      const outputData = await editor.save()
      console.log(outputData.blocks);
    } catch (e) {
      console.log('Saving failed: ', e)
    }
  }


  const createPost = async (data) => {
    const outputData = await editor.save()
    const postcontent = outputData.blocks;

    data.content_html = postcontent;

    createDoc('Blog Post', data)
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
        <form onSubmit={handleSubmit(createPost)}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="main-title">Add Post</h1>
            <div className="flex gap-x-4">
              <button
                {...register('published')}
                className="btn primary-btn"
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


          <button onClick={onSave}>Save</button>         

          <EditorJs tools={EDITOR_JS_TOOLS} onChange={onChange} editorInstance={editorInstance => { editor = editorInstance }}/>

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