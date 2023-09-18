import { useFrappeGetDocList, useFrappeCreateDoc, useFrappeDocTypeEventListener, useFrappeDeleteDoc, useFrappeUpdateDoc } from 'frappe-react-sdk'
import Sidebar from '../components/sidebar';
import LoadingCircle from '../components/loading';
import { useLayoutEffect, Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, CheckCircleIcon, XMarkIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom';
import { HomeSmile } from '@untitled-ui/icons-react/build/cjs';

const Tags = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [limitCate, setLimitCate] = useState(5)

  const { data, isLoading, error, mutate } = useFrappeGetDocList('Tag', {
    fields: ['name'],
    limit_start: limitCate * currentPage,
    limit: limitCate
  })

  const { data:allCate } = useFrappeGetDocList('Tag')

  const [defaultCate, setDefaultCate] = useState('');

  const goPrevPage = () => {
    if (currentPage > 0){
      setCurrentPage(currentPage - 1)
    }
  }

  const goNextPage = () => {
    if (allCate){
      if (currentPage < Math.ceil(allCate.length / limitCate) - 1){
        setCurrentPage(currentPage + 1)
      }
    }
  }

  const [rowNum, setRowNum] = useState(null);
  const [rowName, setRowName] = useState(null)

  const [showAddNotification, setShowAddNotification] = useState(false)
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)
  const [showDeleteNotification, setShowDeleteNotification] = useState(false)

  const { createDoc, loading, error: errorCreateDoc } = useFrappeCreateDoc()
  const { updateDoc, loading: loadingUpdate } = useFrappeUpdateDoc();
  const { deleteDoc, loading: loadingDelete } = useFrappeDeleteDoc();
  const { register, handleSubmit, formState: {errors} } = useForm()

  const [openAddCate, setOpenAddCate] = useState(false)
  const [openUpdateCate, setOpenUpdateCate] = useState(false)
  const [openDeleteCate, setOpenDeleteCate] = useState(false)

  const cancelButtonRef = useRef(null)

  const [showError, setShowError] = useState(false);

  const openToUpdateCate = (index, name) => {
    setOpenUpdateCate(true);
    setDefaultCate(name);
    setRowNum(index);
    setRowName(name);
  }

  const openToDeleteCate = (index, name) => {
    setOpenDeleteCate(true);
    setRowNum(index);
    setRowName(name);
  }

  const closeUpdateCate = () => {
    setOpenUpdateCate(false);
    setTimeout(() => {
      setDefaultCate('')
    }, 500)
  }

  const addBlogCate = (data) => {
    createDoc('Tag', data)
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

  const updateBlogCate = (info) => {
    updateDoc('Tag', data[rowNum].name, info)
    .then(() => {
      mutate()
      setOpenUpdateCate(false);
      setShowUpdateNotification(true);
      setShowError(false);
      setTimeout(() => {
        setShowUpdateNotification(false)
      }, 10000)
    })
    .catch(() => {
      setOpenUpdateCate(false);
      setShowUpdateNotification(true);
      setShowError(true);
      setTimeout(() => {
        setShowUpdateNotification(false)
      }, 10000)
    })
  }

  const deleteBlogCate = (info) => {
    deleteDoc('Tag', data[rowNum].name, info)
    .then(() => {
      mutate()
      setOpenDeleteCate(false);
      setShowDeleteNotification(true);
      setShowError(false);
      setTimeout(() => {
        setShowDeleteNotification(false)
      }, 10000)
    })
    .catch(() => {
      setOpenDeleteCate(false);
      setShowDeleteNotification(true);
      setShowError(true);
      setTimeout(() => {
        setShowDeleteNotification(false)
      }, 10000)
    })
  }

  useFrappeDocTypeEventListener('Tag', (d) => {
    console.log(d)
    if (d.doctype === 'Tag'){
      mutate()
    }
  })

  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedData, setSelectedData] = useState([])

  // useLayoutEffect(() => {
  //   const isIndeterminate = selectedData.length > 0 && selectedData.length < data.length
  //   setChecked(selectedData.length === data.length)
  //   setIndeterminate(isIndeterminate)
  //   checkbox.current.indeterminate = isIndeterminate
  // }, [selectedData])

  function toggleAll() {
    setSelectedData(checked || indeterminate ? [] : data)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  const PaginationNum = () => {
    if (allCate){
      const allPages = Math.ceil(allCate.length / limitCate);
      let pages = []

      const goToPage = (pageNum) => {
        setCurrentPage(pageNum);
      }

      for (let i = 0; i < allPages; i++){
        pages.push(
          <button key={i} onClick={() => goToPage(i)}
            className={`relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 ${currentPage == i ? 'border-[#0099FF] z-10' : 'border-gray-300'}`}
          >
            {i + 1}
          </button>
        )
      }

      return pages;
    }
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
                <p className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Tags
                </p>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center justify-between mb-8">
          <h1 className="main-title">Tags</h1>
          <button
            className="btn primary-btn"
            onClick={() => setOpenAddCate(true)}
          >
            Add Tag
          </button>
        </div>
        {data && (
          <div className="flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden ring-1 ring-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className='table-head'>
                      <tr>
                        <th scope="col" className="relative w-12">
                          <input
                            type="checkbox"
                            className="table-checkbox"
                            ref={checkbox}
                            checked={checked}
                            onChange={toggleAll}
                          />
                        </th>
                        <th scope="col" className="table-head-text w-[50%]">
                          Category
                        </th>
                        <th scope="col" className="table-head-text text-right pr-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {data.map((d, index) => (
                        <tr key={d.name}>
                          <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                            <input
                              type="checkbox"
                              className="table-checkbox"
                              value={d.name}
                              checked={selectedData.includes(d)}
                              onChange={(e) =>
                                setSelectedData(
                                  e.target.checked
                                    ? [...selectedData, d]
                                    : selectedData.filter((p) => p !== d)
                                )
                              }
                            />
                          </td>
                          <td className="table-title w-[50%]">
                            {d.name}
                          </td>
                          <td className="relative whitespace-nowrap py-4 flex gap-x-3 justify-end pr-4">
                            <button className='btn secondary-btn' onClick={() => {openToUpdateCate(index, d.name)}}>Edit</button>
                            <button className='btn primary-btn error' onClick={() => openToDeleteCate(index, d.name)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 bg-white py-3">
              <div className="flex flex-1 items-center justify-between">
                {allCate && (
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage * limitCate) + 1}</span> to <span className="font-medium">{currentPage == Math.ceil(allCate.length / limitCate) - 1 ? allCate.length : limitCate * (currentPage + 1)}</span> of{' '}
                      <span className="font-medium">{allCate.length}</span> {allCate.length == 1 ? 'result' : 'results'}
                    </p>
                  </div>
                )}
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={goPrevPage}
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <PaginationNum />

                    <button
                      onClick={goNextPage}
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
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
                <h3 className="text-sm font-medium text-red-800">There was an error loading the data, please try again.</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create modal when adding a category */}

      <Transition.Root show={openAddCate} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" initialFocus={cancelButtonRef} onClose={setOpenAddCate}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <form onSubmit={handleSubmit(addBlogCate)}>
                    <div className="bg-white p-6">
                      <div className="text-left">
                        <label htmlFor='add-cate' className="main-heading">
                          Add Tag
                        </label>
                        <div className="mt-4">
                          <input
                            type="text"
                            name="add-cate"
                            id="add-cate"
                            className="form-input"
                            placeholder='Enter the tag name'
                            {...register('title', {
                              required: 'This field is required.',
                            })}
                          />
                          <p className='mt-2 text-xs '>{errors.title?.message}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 py-4 flex px-6 justify-end gap-x-3">
                      <button
                        className="btn white-outline-btn"
                        onClick={(e) => {e.preventDefault();setOpenAddCate(false)}}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className="btn primary-btn"
                      >
                        {loading ? 'Adding' : 'Add'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Create modal when updating a category */}

      <Transition.Root show={openUpdateCate} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" initialFocus={cancelButtonRef} onClose={closeUpdateCate}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <form onSubmit={handleSubmit(updateBlogCate)}>
                    <div className="bg-white p-6">
                      <div className="text-left">
                        <label htmlFor='edit-cate' className="main-heading">
                          Edit Tag: {rowName}
                        </label>
                        <div className="mt-4">
                          <input
                            type="text"
                            name="edit-cate"
                            id="edit-cate"
                            className="form-input"
                            placeholder='Enter the tag name'
                            defaultValue={defaultCate}
                            {...register('title', {
                              required: 'This field is required.',
                            })}
                          />
                          <p className='mt-2 text-xs '>{errors.title?.message}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 py-4 flex px-6 justify-end gap-x-3">
                      <button
                        className="btn white-outline-btn"
                        onClick={(e) => {e.preventDefault();closeUpdateCate()}}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className="btn primary-btn"
                        onClick={updateBlogCate}
                      >
                        {loadingUpdate ? 'Editing' : 'Edit'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openDeleteCate} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" initialFocus={cancelButtonRef} onClose={setOpenDeleteCate}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <form onSubmit={handleSubmit(deleteBlogCate)}>
                    <div className="bg-white p-6">
                      <div className="text-left">
                        <label htmlFor='add-cate' className="main-heading">
                          Delete Tag: {rowName}
                        </label>
                        <div className="mt-4">
                          <p>Are you sure to delete this tag? This action cannot be undone.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 py-4 flex px-6 justify-end gap-x-3">
                      <button
                        className="btn white-outline-btn"
                        onClick={(e) => {e.preventDefault();setOpenDeleteCate(false)}}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className="btn primary-btn error"
                        onClick={deleteBlogCate}
                      >
                        {loadingDelete ? 'Deleting' : 'Delete'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* The nofitication for confirmation of adding a blog category */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[999]"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={showAddNotification}
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
                        <p className="mt-1 text-sm text-gray-500">There has been an error adding the tag, please try again.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">Tag added</p>
                        <p className="mt-1 text-sm text-gray-500">A tag has been successfully added.</p>
                      </div>
                    </>
                  )}
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShowAddNotification(false)
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

      {/* The nofitication for confirmation of updating a blog category */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[999]"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={showUpdateNotification}
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
                        <p className="mt-1 text-sm text-gray-500">There has been an error updating the tag, please try again.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">Tag updated</p>
                        <p className="mt-1 text-sm text-gray-500">This tag has been successfully updated.</p>
                      </div>
                    </>
                  )}
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShowUpdateNotification(false)
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

      {/* The nofitication for confirmation of deleting a blog category */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[999]"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={showDeleteNotification}
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
                        <p className="mt-1 text-sm text-gray-500">There has been an error deleting the tag, please try again.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">Tag deleted</p>
                        <p className="mt-1 text-sm text-gray-500">This tag has been successfully deleted.</p>
                      </div>
                    </>
                  )}
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShowDeleteNotification(false)
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

export default Tags;