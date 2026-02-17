import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import { User, Settings, Save } from 'lucide-react'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ full_name: '', gender: '', body_size: '', face_image: null, location: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  const [activeTab, setActiveTab] = useState('account')
  const [prefs, setPrefs] = useState({ email_notifications: true })

  useEffect(() => {
    if (!user) return
    setFormData({
      full_name: user.full_name || '',
      gender: user.gender || '',
      body_size: user.body_size || '',
      face_image: null,
      location: user.location || ''
    })
    setPreviewImage(null)
  }, [user])

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    try {
      // placeholder: call updateProfile if available
      if (updateProfile) await updateProfile(formData)
      setIsEditing(false)
      alert('Profile saved (UI placeholder)')
    } catch (err) {
      console.error(err)
      alert('Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  function handlePrefsSave() {
    alert('Preferences saved (UI-only)')
  }

  function handlePasswordChange(e) {
    e.preventDefault()
    alert('Password change submitted (not implemented)')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">View and manage your account, preferences and security settings.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <aside className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
                      {user?.face_image_url ? (
                        <img src={user.face_image_url} alt={user.full_name || 'Profile'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold text-gray-900">{user?.full_name || 'User'}</h2>
                    <p className="text-sm text-gray-600 mt-1 truncate max-w-[18rem]">{user?.email}</p>

                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {user?.gender && <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs capitalize">{user.gender}</span>}
                      {user?.body_size && <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs capitalize">{user.body_size.replace('_', ' ')}</span>}
                    </div>

                    <div className="mt-6 w-full flex flex-col gap-3">
                      <button onClick={() => setIsEditing(true)} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Edit Profile</button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {isEditing && (
            <main className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative z-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2"><Settings className="w-5 h-5" /> Account Settings</h3>
                  <div className="mt-3 sm:mt-0">
                    <nav className="flex gap-2">
                      <button onClick={() => setActiveTab('account')} className={`px-3 py-1 rounded-md ${activeTab === 'account' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Account</button>
                      <button onClick={() => setActiveTab('preferences')} className={`px-3 py-1 rounded-md ${activeTab === 'preferences' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Preferences</button>
                    </nav>
                  </div>
                </div>

                <div className="mt-4">
                  {activeTab === 'account' && (
                    isEditing ? (
                      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-700">Full name</label>
                          <input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700">Gender</label>
                          <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg">
                            <option value="">Auto</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700">Body size</label>
                          <select value={formData.body_size} onChange={(e) => setFormData({ ...formData, body_size: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg">
                            <option value="">Auto</option>
                            <option value="very_slim">Very Slim</option>
                            <option value="slim">Slim</option>
                            <option value="average">Average</option>
                            <option value="chubby">Chubby</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-700">Location</label>
                          <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="City or lat,lon" />
                          <p className="text-xs text-gray-500 mt-1">Used to provide local weather context for outfit recommendations.</p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-gray-300" />
                              ) : user?.face_image_url ? (
                                <img src={user.face_image_url} alt="Current" className="w-20 h-20 rounded-full object-cover border-2 border-gray-300" />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                  <User className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    setFormData({ ...formData, face_image: file })
                                    const reader = new FileReader()
                                    reader.onload = (ev) => setPreviewImage(ev.target.result)
                                    reader.readAsDataURL(file)
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                              <p className="text-xs text-gray-500 mt-1">Upload a new profile picture (max 10MB)</p>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
                          <button type="submit" disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button type="button" onClick={() => { setIsEditing(false); setFormData({ full_name: user?.full_name || '', gender: user?.gender || '', body_size: user?.body_size || '', face_image: null, location: user?.location || '' }); setPreviewImage(null) }} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <div className="text-sm text-gray-700">Full name</div>
                          <div className="mt-1 text-gray-900">{user?.full_name || '-'}</div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-700">Gender</div>
                          <div className="mt-1 text-gray-900 capitalize">{user?.gender || 'Auto'}</div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-700">Body size</div>
                          <div className="mt-1 text-gray-900">{user?.body_size ? user.body_size.replace('_', ' ') : 'Auto'}</div>
                        </div>

                        <div className="md:col-span-2">
                          <div className="text-sm text-gray-700">Location</div>
                          <div className="mt-1 text-gray-900">{user?.location || '-'}</div>
                        </div>

                        <div className="md:col-span-2">
                          <div className="text-sm font-medium text-gray-700 mb-2">Profile Picture</div>
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {user?.face_image_url ? (
                                <img src={user.face_image_url} alt="Current" className="w-20 h-20 rounded-full object-cover border-2 border-gray-300" />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                  <User className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500">To change your profile picture or other details, click Edit Profile.</p>
                            </div>
                          </div>
                        </div>

                        
                      </div>
                    )
                  )}

                  {activeTab === 'preferences' && (
                    <div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-700">Email notifications</div>
                            <div className="text-xs text-gray-500">Receive product and feature updates (saved automatically)</div>
                          </div>
                          <div>
                            <label className="inline-flex items-center">
                              <input type="checkbox" checked={prefs.email_notifications} onChange={(e) => { setPrefs({ ...prefs, email_notifications: e.target.checked }); alert('Preference saved automatically'); }} className="form-checkbox" />
                            </label>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">Your preference changes are saved automatically.</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div>
                      <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-700">Current password</label>
                          <input type="password" className="w-full mt-1 px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-700">New password</label>
                          <input type="password" className="w-full mt-1 px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-700">Confirm new password</label>
                          <input type="password" className="w-full mt-1 px-3 py-2 border rounded-lg" />
                        </div>

                        <div className="md:col-span-2 mt-2">
                          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg">Change password</button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </main>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
