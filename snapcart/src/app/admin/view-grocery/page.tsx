'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Loader, Package, Pencil, Search, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IGrocery } from '@/models/grocery.model'
import Image from 'next/image'

const categories = [
  "Fruits & Vegetable",
  "Dairy & Eggs",
  "Rice ", "Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masals",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care"
]

const units = [
  "kg", "g", "liter", "ml", "price", "pack"
]

function ViewGrocery() {
  const router = useRouter()
  const [groceries, setGroceries] = useState<IGrocery[]>([]) 
  const [editing, setEditing] = useState<IGrocery | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [backendImage, setBackendImage] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState("")

  // 🎯 এপিআই থেকে ডেটা লোড করা
  useEffect(() => {
    const getGroceries = async () => {
      try {
        const result = await axios.get("/api/admin/get-groceries")
        setGroceries(result.data)
      } catch (error) {
        console.log(error)
      }
    }
    getGroceries();
  }, [])

  // 🎯 স্টেট ছাড়াই রান-টাইমে রিয়েল-টাইম সার্চ ফিল্টারিং (এরর ফ্রি সমাধান)
  const filteredGroceries = groceries?.filter((g) => {
    const q = search.toLowerCase();
    return g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q);
  }) || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBackendImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleEdit = async () => {
    setLoading(true)
    if (!editing) return
    try {
      const formData = new FormData()
      formData.append("groceryId", editing!._id!.toString());
      formData.append("name", editing?.name)
      formData.append("category", editing?.category)
      formData.append("price", String(editing?.price))
      formData.append("unit", editing?.unit)
      if (backendImage) {
        formData.append("image", backendImage)
      }
      await axios.post("/api/admin/edit-grocery", formData)
      setLoading(false)
      window.location.reload()
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    if (!editing) return
    try {
      await axios.post("/api/admin/delete-grocery", { groceryId: editing._id })
      setDeleteLoading(false)
      window.location.reload()
    } catch (error) {
      console.log(error)
      setDeleteLoading(false)
    }
  }

  return (
    <div className='pt-4 md:w-[85%] mx-auto pb-20'>
      {/* হেডার সেকশন */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left'
      >
        <button
          onClick={() => router.push("/")}
          className='flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-600 font-semibold px-4 rounded-full transition w-full sm:w-auto'
        >
          <ArrowLeft size={18} /><span>Back</span>
        </button>
        <h1 className='text-2xl md:text-3xl font-extrabold text-amber-600 flex items-center'>
          <Package size={30} className='text-amber-600' />Manage Groceries
        </h1>
      </motion.div>

      {/* সার্চ সেকশন */}
      <div className='flex sm:flex-row items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full gap-4'>
        <Search className='text-gray-500 w-5 h-5 mr-2' />
        <input 
          type='text' 
          className='w-full outline-none text-gray-700 placeholder-gray-400' 
          placeholder='Search by name or category...'
          onChange={(e) => setSearch(e.target.value)} 
          value={search} 
        />
      </div>

      {/* গ্রোসারি কার্ড লিস্ট */}
      <div className='space-y-4'>
        {filteredGroceries.map((g, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100 }}
            className='bg-white rounded-2xl shadow-md flex flex-col sm:flex-row items-stretch gap-5 p-5 transition-all'
          >
            <div className='relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200 flex-shrink-0'>
              <Image
                src={g.image}
                alt={g.name}
                fill
                className='object-cover hover:scale-110 transition-transform duration-500'
              />
            </div>

            <div className='flex-1 flex flex-col justify-between w-full sm:h-44 py-1'>
              <div>
                <h3 className='font-semibold text-gray-800 text-lg truncate'>{g.name}</h3>
                <p className='text-gray-500 text-sm capitalize'>{g.category}</p>
              </div>

              <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                <p className='text-amber-500 font-bold text-lg'>
                  ${g.price}/ <span className='text-gray-500 text-sm font-medium ml-1'>{g.unit}</span>
                </p>

                <button 
                  className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors flex justify-center items-center gap-1" 
                  onClick={() => {
                    setEditing(g);
                    setImagePreview(g.image); // 🎯 বাটনে ক্লিকের সাথে প্রিভিউ সেট হবে
                  }}
                >
                  <Pencil size={16} /> Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* এডিট মোডাল */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/40 flex items-center justify-center z-40 backdrop-blur-sm px-4'
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 relative flex flex-col max-h-[85vh] overflow-y-auto'
            >
              <div className='flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100'>
                <h2 className='text-xl font-bold text-amber-500'>Edit Grocery</h2>
                <button className='text-gray-500 hover:text-red-500 transition-colors' onClick={() => setEditing(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className='relative h-36 w-full rounded-xl overflow-hidden mb-4 border border-gray-200 group bg-gray-50 flex items-center justify-center'>
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt={editing.name || "Preview"}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='flex flex-col items-center gap-1 text-gray-400 text-xs'>
                    <Upload size={20} />
                    <span>Upload Image</span>
                  </div>
                )}
                <label htmlFor="imageUpload" className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity duration-200">
                  <Upload size={20} />
                </label>
                
                <input 
                  id="imageUpload" 
                  type="file" 
                  accept='image/*' 
                  hidden 
                  onChange={handleImageUpload} 
                />
              </div>

              <div className='space-y-3.5 flex-1'>
                <div>
                  <label className='text-xs font-medium text-gray-500 block mb-1'>Grocery Name</label>
                  <input type="text"
                    placeholder='Enter Grocery Name'
                    value={editing.name || ''}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className='w-full border border-gray-300 rounded-xl p-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all' />
                </div>

                <div>
                  <label className='text-xs font-medium text-gray-500 block mb-1'>Category</label>
                  <select className='w-full border border-gray-300 rounded-xl p-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white transition-all'
                    value={editing.category || ''}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='text-xs font-medium text-gray-500 block mb-1'>Price ($)</label>
                    <input type="number"
                      placeholder='Price'
                      value={editing.price || ''}
                      onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                      className='w-full border border-gray-300 rounded-xl p-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all' />
                  </div>

                  <div>
                    <label className='text-xs font-medium text-gray-500 block mb-1'>Unit</label>
                    <select className='w-full border border-gray-300 rounded-xl p-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white transition-all'
                      value={editing.unit || ''}
                      onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
                    >
                      <option value="">Select Unit</option>
                      {units.map((u, i) => (
                        <option key={i} value={u}>{u}</option>
                    ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-2.5 mt-5 pt-3 border-t border-gray-100 bg-white sticky bottom-0'>
                <button className='px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600 active:scale-95 transition-all shadow-sm shadow-amber-500/20'
                  onClick={handleEdit}
                  disabled={loading}>
                  {loading ? <Loader size={14} className="animate-spin" /> : "Edit Changes"} 
                </button>
                <button 
                  className='px-4 py-2 text-sm font-medium rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 transition-all'
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? <Loader size={14} className="animate-spin" /> : "Delete"} 
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ViewGrocery