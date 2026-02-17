"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getWardrobeItems, toggleLike, updateCategory, analyzeClothingImage, uploadWardrobeItem, updateColor, updateOccasion, updatePattern, getUploadLimits, canUpload, toggleStar, updateWardrobeItemImage, deleteWardrobeItem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { Shirt, Upload, Sparkles, Trash2, Edit3, Star, SlidersHorizontal, PlusCircle } from 'lucide-react';
import ThreeDCard from './ThreeDCard';
import UpgradeModal from './UpgradeModal';
import WardrobeItemModal from './WardrobeItemModal';

// TypeScript interface for wardrobe item props
interface WardrobeItemProps {
  id: number;
  imageUrl: string;
  title: string;
  category: string;
  /** type of garment (e.g., 'top', 'bottom', 'outerwear') */
  type?: string;
  color: string;
  occasion: string;
  liked?: boolean;
  pattern?: string;
  detection_confidence?: number;
  starred: boolean;
}

// Mock data for wardrobe items, based on ClosetAI API structure
const wardrobeData: WardrobeItemProps[] = [
  {
    id: 1,
    imageUrl: 'https://i.pinimg.com/1200x/93/b6/9f/93b69fd5d973b3f2fbc325982eb8e658.jpg',
    title: 'Blue Jeans',
    category: 'Bottom',
    color: 'Blue',
    occasion: 'Casual',
    starred: false,
  },
  {
    id: 2,
    imageUrl: 'https://i.pinimg.com/1200x/c5/3e/6e/c53e6e265a893d70b00070563d063606.jpg',
    title: 'White T-Shirt',
    category: 'Top',
    color: 'White',
    occasion: 'Casual',
    starred: false,
  },
  {
    id: 3,
    imageUrl: 'https://i.pinimg.com/736x/c6/1c/ae/c61cae893723278b817cd64ffc966bf8.jpg',
    title: 'Black Dress',
    category: 'Dress',
    color: 'Black',
    occasion: 'Formal',
    starred: false,
  },
  {
    id: 4,
    imageUrl: 'https://i.pinimg.com/1200x/e1/6c/58/e16c5867c9dcb1334d45cf51caee3563.jpg',
    title: 'Red Sneakers',
    category: 'Shoes',
    color: 'Red',
    occasion: 'Casual',
    starred: false,
  },
  {
    id: 5,
    imageUrl: 'https://i.pinimg.com/736x/c0/09/b1/c009b1bd4d8bb5439c59221e2eca7516.jpg',
    title: 'Green Jacket',
    category: 'Outerwear',
    color: 'Green',
    occasion: 'Casual',
    starred: false,
  },
  {
    id: 6,
    imageUrl: 'https://i.pinimg.com/736x/fb/27/0f/fb270f928d2af556c9d97f2af5fb908d.jpg',
    title: 'Yellow Skirt',
    category: 'Bottom',
    color: 'Yellow',
    occasion: 'Casual',
    starred: false,
  },
  {
    id: 7,
    imageUrl: 'https://i.pinimg.com/1200x/af/5f/3d/af5f3d7fc5d2cd647fc5559c86b61096.jpg',
    title: 'Purple Blouse',
    category: 'Top',
    color: 'Purple',
    occasion: 'Formal',
    starred: false,
  },
  {
    id: 8,
    imageUrl: 'https://i.pinimg.com/736x/a8/13/20/a81320aa1ad808fa2fe9d05d06f06a6c.jpg',
    title: 'Brown Boots',
    category: 'Shoes',
    color: 'Brown',
    occasion: 'Casual',
    starred: false,
  },
  {
    id: 9,
    imageUrl: 'https://i.pinimg.com/1200x/4a/2a/8b/4a2a8b8d5c9a4cccc8de1e015119dfb3.jpg',
    title: 'Gray Sweater',
    category: 'Top',
    color: 'Gray',
    occasion: 'Casual',
    starred: false,
  },
  {
    id: 10,
    imageUrl: 'https://i.pinimg.com/1200x/97/67/23/976723dda78a202b1ddbc5fc674c7511.jpg',
    title: 'Pink Scarf',
    category: 'Accessory',
    color: 'Pink',
    occasion: 'Casual',
    starred: false,
  },
  {
    id: 11,
    imageUrl: 'https://i.pinimg.com/1200x/67/99/6a/67996a2154fd2a8da518e4bfb45c1474.jpg',
    title: 'Orange Hat',
    category: 'Accessory',
    color: 'Orange',
    occasion: 'Casual',
    starred: false,
  },
  {
    id: 12,
    imageUrl: 'https://i.pinimg.com/1200x/2a/59/11/2a591199f4558350175dd0b2e120558a.jpg',
    title: 'Navy Pants',
    category: 'Bottom',
    color: 'Navy',
    occasion: 'Formal',
    starred: false,
  },
];

// SVG Icon Components (keeping for design, but can be adapted)
const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20.8401 4.60999C20.3294 4.099 19.7229 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.9501 2.99817C16.2277 2.99817 15.5122 3.14052 14.8447 3.41708C14.1772 3.69364 13.5707 4.099 13.0601 4.60999L12.0001 5.66999L10.9401 4.60999C9.90843 3.5783 8.50915 2.9987 7.05008 2.9987C5.59102 2.9987 4.19174 3.5783 3.16008 4.60999C2.12843 5.64166 1.54883 7.04094 1.54883 8.49999C1.54883 9.95905 2.12843 11.3583 3.16008 12.39L12.0001 21.23L20.8401 12.39C21.8717 11.3583 22.4513 9.95905 22.4513 8.49999C22.4513 7.04094 21.8717 5.64166 20.8401 4.60999Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.0002 22.6667L11.9468 22.5867L5.3335 14L12.0002 17.3333L18.6668 14L12.0002 22.6667Z" fill="currentColor"/>
        <path d="M12 1.33331L5.33333 12.6666L12 16V1.33331Z" fill="currentColor" fillOpacity="0.6"/>
        <path d="M12 1.33331L18.6667 12.6666L12 16V1.33331Z" fill="currentColor" fillOpacity="0.8"/>
        <path d="M5.3335 14L12.0002 17.3333V22.6666L5.3335 14Z" fill="currentColor" fillOpacity="0.6"/>
        <path d="M18.6668 14L12.0002 17.3333V22.6666L18.6668 14Z" fill="currentColor" fillOpacity="0.8"/>
    </svg>
);

// The Wardrobe Item Card Component
const WardrobeItemCard: React.FC<WardrobeItemProps & { 
  onStar: (id: number) => void;
  onUpdateItem: (id: number, updates: Partial<WardrobeItemProps>) => void;
  onDeleteItem: (id: number) => void;
  onUpdateImage: (id: number, file: File) => void;
  onItemClick: (item: any, rect: DOMRect, tryOn?: boolean) => void;
}> = ({ 
  id, 
  imageUrl, 
  title, 
  category,
  type,
  color, 
  occasion, 
  pattern, 
  detection_confidence, 
  liked, 
  starred,
  onStar,
  onUpdateItem, 
  onDeleteItem,
  onUpdateImage,
  onItemClick
}) => {
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    category: category || '',
    type: type || '',
    color: color || '',
    occasion: occasion || '',
    pattern: pattern || ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveAll = async () => {
    const updates: any = {};
    const fields: Array<keyof typeof editValues> = ['category','type','color','occasion','pattern'];
    for (const f of fields) {
      const newVal = (editValues[f] || '').trim();
      const oldVal = { category, type, color, occasion, pattern }[f];
      if (newVal && newVal !== oldVal) updates[f] = newVal;
    }
    if (Object.keys(updates).length > 0) {
      try {
        await onUpdateItem(id, updates);
      } catch (e) {
        console.error('Failed to save item updates', e);
      }
    }
    setIsEditingAll(false);
  };

  const handleCancelEditing = () => {
    setEditValues({
      category: category || '',
      type: type || '',
      color: color || '',
      occasion: occasion || '',
      pattern: pattern || ''
    });
    setIsEditingAll(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDeleteItem(id);
    }
    setShowDeleteConfirm(false);
  };

  const handleImageEdit = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdateImage(id, file);
    }
  };

  const renderEditableField = (field: string, label: string, value: string | undefined) => {
    const displayValue = value || 'unknown';
    const isEditingField = editingField === field || isEditingAll;

    return (
      <div className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
        <span className="font-medium">{label}:</span>{' '}
        {isEditingField ? (
          <input
            autoFocus={!isEditingAll}
            type="text"
            value={editValues[field as keyof typeof editValues]}
            onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
            onKeyDown={(e) => handleFieldKeyPress(e as React.KeyboardEvent<HTMLInputElement>, field)}
            onBlur={() => { if (!isEditingAll) handleFieldSubmit(field); }}
            className="inline-block bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 w-full"
          />
        ) : (
          // allow clicking the value to edit a single field when not bulk-editing
          <span
            className={`text-sm ${!isEditingAll ? 'text-blue-600 dark:text-blue-400 cursor-pointer hover:underline' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => { if (!isEditingAll) setEditingField(field); }}
          >
            {displayValue}
          </span>
        )}
      </div>
    );
  };

  const handleFieldSubmit = (field: string) => {
    const newValue = (editValues[field as keyof typeof editValues] || '').trim();
    const oldValue = ({ category, type, color, occasion, pattern } as any)[field];
    if (newValue && newValue !== oldValue) {
      onUpdateItem(id, { [field]: newValue } as any);
    }
    setEditingField(null);
  };

  const handleFieldKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
    if (e.key === 'Enter') {
      handleFieldSubmit(field);
    } else if (e.key === 'Escape') {
      setEditValues({
        category: category || '',
        type: type || '',
        color: color || '',
        occasion: occasion || '',
        pattern: pattern || ''
      });
      setEditingField(null);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-black shadow-lg shadow-gray-200/50 dark:shadow-black/20 transition-all duration-300 hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-black/40 hover:-translate-y-1 hover:border-black w-full font-space-grotesk">
      <div className="relative p-2 sm:p-2.5">
          {/* Card Image Section */}
            <div className="relative cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onItemClick({ id, imageUrl, title, category, type, color, occasion, pattern, detection_confidence, liked, starred }, rect);
          }}>
            <ThreeDCard backgroundImage={imageUrl} className="w-full rounded-xl sm:rounded-2xl">
              <div style={{ width: '100%', height: 0, paddingBottom: '100%' }} aria-hidden />
            </ThreeDCard>

            {/* Bottom-right confidentiality tag on the image */}
            {detection_confidence !== undefined && detection_confidence !== null && (
              <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/75 text-xs md:text-sm px-2 py-1 rounded-full font-medium shadow-md backdrop-blur-sm">
                Conf: {Math.round(detection_confidence * 100)}%
              </div>
            )}

            {/* Overlays (top-right) */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onStar(id); }} 
                className={`bg-black/70 dark:bg-black/70 p-2 sm:p-2 md:p-3 rounded-full transition-colors hover:text-yellow-500 backdrop-blur-sm border border-white/20 ${starred ? 'text-yellow-500' : 'text-white'}`}
                title="Star this item"
              >
                <Star className="w-4 h-4 sm:w-4 md:w-5 sm:h-4 md:h-5 fill-current" />
              </button>
              <button
                onClick={(e: any) => { e.stopPropagation(); onItemClick({ id, imageUrl, title, category, type, color, occasion, pattern, detection_confidence, liked, starred }, e.currentTarget.getBoundingClientRect(), true); }}
                className="bg-black/70 dark:bg-black/70 p-2 sm:p-2 md:p-3 rounded-full transition-colors hover:text-indigo-400 backdrop-blur-sm border border-white/20 text-white"
                title="Try-on (coming soon)"
              >
                <Sparkles className="w-4 h-4 sm:w-4 md:w-5 sm:h-4 md:h-5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleImageEdit(); }} 
                className="bg-black/70 dark:bg-black/70 p-2 sm:p-2 md:p-3 rounded-full transition-colors hover:text-blue-500 backdrop-blur-sm border border-white/20 text-white"
                title="Edit image"
              >
                <Edit3 className="w-4 h-4 sm:w-4 md:w-5 sm:h-4 md:h-5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }} 
                className="bg-black/70 dark:bg-black/70 p-2 sm:p-2 md:p-3 rounded-full transition-colors hover:text-red-500 backdrop-blur-sm border border-white/20 text-white"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4 sm:w-4 md:w-5 sm:h-4 md:h-5" />
              </button>
            </div>

            {/* Hidden file input for image editing */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl sm:rounded-2xl">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs mx-4">
                  <p className="text-sm text-gray-900 dark:text-white mb-4">Delete this item?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded text-sm font-medium hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Card Content Section */}
          <div className="mt-3 sm:mt-4 px-1 sm:px-1.5 pb-2 sm:pb-3 pt-1 sm:pt-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white whitespace-normal break-normal pr-2" title={title}>{title}</h3>
                {/* detection_confidence shown on image tag; removed inline score here */}
            </div>

            {renderEditableField('type', 'Type', type || category)}
            {renderEditableField('color', 'Color', color)}
            {renderEditableField('occasion', 'Occasion', occasion)}
            {renderEditableField('pattern', 'Pattern', pattern)}

            {/* Edit controls: single edit button toggles editing for all fields */}
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              {isEditingAll ? (
                <>
                  <button onClick={(e) => { e.stopPropagation(); handleSaveAll(); }} className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">Save</button>
                  <button onClick={(e) => { e.stopPropagation(); handleCancelEditing(); }} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">Cancel</button>
                </>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); setIsEditingAll(true); }} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 rounded-full text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-150">
                  <Edit3 className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-100">Edit</span>
                </button>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

// Main App Component to display the grid of wardrobe items
const WardrobeGrid: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<WardrobeItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [colorFilter, setColorFilter] = useState<string>('All');
  const [occasionFilter, setOccasionFilter] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLimits, setUploadLimits] = useState(null);
  const [canUploadStatus, setCanUploadStatus] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemSourceRect, setItemSourceRect] = useState<DOMRect | null>(null);
  const [autoTryOn, setAutoTryOn] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    if (user && (!user.gender || !user.face_image_url || !user.body_size)) {
      router.push('/onboarding/gender');
      return;
    }

    fetchWardrobeItems();
    fetchUploadLimits();
  }, [user, router]);

  async function fetchWardrobeItems() {
    try {
      if (process.env.NODE_ENV !== 'production') console.log('Fetching wardrobe items for user:', user?.id);
      const wardrobeItems = await getWardrobeItems();
      if (process.env.NODE_ENV !== 'production') console.log('Raw wardrobe items from API:', wardrobeItems);
      // Transform API response to include title field and fix field names
      const transformedItems = wardrobeItems.map(item => ({
        ...item,
        imageUrl: item.image_url, // Convert snake_case to camelCase
        pattern: item.pattern, // Include pattern field
        detection_confidence: item.detection_confidence, // Include confidence
        starred: item.starred || false, // Include starred field
        // Use AI-detected type if available, otherwise fallback to category
        title: item.type ? `${item.type} - ${item.color || 'Unknown'}` : (item.category ? `${item.category} - ${item.color || 'Unknown'}` : 'Clothing Item')
      }));
      if (process.env.NODE_ENV !== 'production') console.log('Transformed items:', transformedItems);
      setItems(transformedItems);
    } catch (error) {
      console.error('Failed to fetch wardrobe items:', error);
      // For now, keep empty array
    } finally {
      setLoading(false);
    }
  }

  async function fetchUploadLimits() {
    try {
      const limits = await getUploadLimits();
      // Backend returns { uploads: { daily: {...}, monthly: {...} }, ... }
      // Normalize to the shape the UI expects: { daily, monthly }
      setUploadLimits(limits?.uploads ?? limits);
      const canUploadResult = await canUpload();
      setCanUploadStatus(canUploadResult.can_upload);
    } catch (error) {
      console.error('Failed to fetch upload limits:', error);
    }
  }

  const handleUpdateItem = async (itemId: number, updates: Partial<WardrobeItemProps>) => {
    try {
      // Update each field that changed
      const updatePromises = Object.entries(updates).map(async ([field, value]) => {
        switch (field) {
          case 'category':
            return updateCategory(itemId, value as string);
          case 'color':
            return updateColor(itemId, value as string);
          case 'occasion':
            return updateOccasion(itemId, value as string);
          case 'pattern':
            return updatePattern(itemId, value as string);
          default:
            return null;
        }
      });

      await Promise.all(updatePromises);
      
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              ...updates,
              title: updates.category ? `${updates.category} - ${item.color || 'Unknown'}` : item.title
            } 
          : item
      ));
    } catch (e) {
      console.error('Failed to update item', e);
    }
  };

  const handleStar = async (itemId: number) => {
    try {
      const res = await toggleStar(itemId);
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, starred: res.starred } : item));
    } catch (e) {
      console.error('Failed to toggle star', e);
      // Fallback to local toggle
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, starred: !item.starred } : item));
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      await deleteWardrobeItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (e) {
      console.error('Failed to delete item', e);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleUpdateImage = async (itemId: number, file: File) => {
    try {
      const res = await updateWardrobeItemImage(itemId, file);
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, imageUrl: res.image_url } : item));
    } catch (e) {
      console.error('Failed to update image', e);
      alert('Failed to update image. Please try again.');
    }
  };

  const categories = ['All', ...new Set(items.map(item => item.category))];
  const colors = ['All', ...new Set(items.map(item => item.color))];
  const occasions = ['All', ...new Set(items.map(item => item.occasion))];

  const filteredItems = items
    .filter(item =>
      (categoryFilter === 'All' || item.category === categoryFilter) &&
      (colorFilter === 'All' || item.color === colorFilter) &&
      (occasionFilter === 'All' || item.occasion === occasionFilter)
    )
    .sort((a, b) => {
      // Starred items come first
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return 0;
    });

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg mb-6">
          <Shirt className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-space-grotesk">
          Nothing to see here yet
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          You haven't uploaded any clothes yet. Start building your wardrobe to get personalized outfit suggestions!
        </p>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Clothes
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 overflow-hidden pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="sticky top-16 z-20 mt-8 mb-6 sm:mb-8 lg:mb-12 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-4 max-w-[1200px] mx-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-1 font-space-grotesk">My Wardrobe</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Browse, filter, and manage your wardrobe items.</p>
            </div>

            {/* Filters moved into header for faster access */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-2 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <Select value={colorFilter} onValueChange={setColorFilter}>
                <SelectTrigger className="w-36 rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-2 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map(col => <SelectItem key={col} value={col}>{col}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={occasionFilter} onValueChange={setOccasionFilter}>
                <SelectTrigger className="w-36 rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-2 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <SelectValue placeholder="Occasion" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map(occ => <SelectItem key={occ} value={occ}>{occ}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Add button: primary on desktop, compact FAB on mobile */}
            <div className="flex items-center gap-3">
              <button onClick={() => setShowUploadModal(true)} className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow hover:shadow-xl transform hover:scale-105 transition">
                <Upload className="w-4 h-4" />
                Add Clothes
              </button>

              {/* mobile FAB moved out below (keeps header layout clean) */}
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="mb-8 mt-6 sm:mt-8 lg:mt-10" />

            {/* Responsive grid: keep cards at a comfortable min width so text doesn't get squashed */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {filteredItems.map((item) => (
                <WardrobeItemCard 
                  key={item.id} 
                  {...item} 
                  onStar={handleStar}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onUpdateImage={handleUpdateImage}
                  onItemClick={(item, rect, tryOn=false) => {
                    setItemSourceRect(rect);
                    setSelectedItem(item);
                    // Always open item modal, but do not trigger try-on.
                    setAutoTryOn(false);
                    setShowItemModal(true);
                    // If user clicked the try-on action, inform them it's coming soon
                    if (tryOn) {
                      setUpgradeFeature('try_on');
                      setShowUpgradeModal(true);
                    }
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile floating Add Clothes FAB (only on small screens). Hidden when wardrobe is empty because EmptyState already shows a primary button. */}
      {items.length > 0 && (
        <button
          onClick={() => setShowUploadModal(true)}
          aria-label="Add clothes"
          className="sm:hidden fixed bottom-6 right-4 z-50 inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={() => {
            setShowUploadModal(false);
            fetchWardrobeItems(); // Refresh the wardrobe items
            fetchUploadLimits(); // Refresh upload limits after successful upload
          }}
          onUpgradeNeeded={(feature) => {
            setShowUploadModal(false);
            setUpgradeFeature(feature);
            setShowUpgradeModal(true);
          }}
          canUploadStatus={canUploadStatus}
          uploadLimits={uploadLimits}
        />
      )}

      {/* Stats Modal */}
      {showItemModal && selectedItem && (
        <WardrobeItemModal
          item={selectedItem}
          isOpen={showItemModal}
          autoTryOn={autoTryOn}
          onClose={() => {
            setShowItemModal(false);
            setSelectedItem(null);
            setItemSourceRect(null);
            setAutoTryOn(false);
          }}
          sourceRect={itemSourceRect}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature || undefined}
      />
    </div>
  );
};

// Upload Modal Component
const UploadModal: React.FC<{
  onClose: () => void;
  onUploadSuccess: () => void;
  onUpgradeNeeded: (feature: string) => void;
  canUploadStatus: boolean;
  uploadLimits?: any;
}> = ({ onClose, onUploadSuccess, onUpgradeNeeded, canUploadStatus, uploadLimits }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploadResults, setUploadResults] = useState<any[] | null>(null);
  const [preparedUploads, setPreparedUploads] = useState<any[]>([]);
  const [cancelled, setCancelled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  }

  function removeFile(index: number) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }

  function closeModal() {
    // Mark cancelled so any in-flight processing stops before uploading
    setCancelled(true);
    // Abort any in-flight HTTP requests
    try { abortControllerRef.current?.abort(); } catch (e) {}
    abortControllerRef.current = null;
    setIsLoading(false);
    setSelectedFiles([]);
    onClose();
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return;

    // Check upload limits first
    if (!canUploadStatus) {
      onUpgradeNeeded('uploads');
      return;
    }

    setCancelled(false);
    // Create a new AbortController for this upload session
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    try {
      // Initialize placeholders so UI shows loading state per-file
      const results: any[] = selectedFiles.map((file) => ({ fileName: file.name, detected: null, uploaded: null, status: 'pending' }));
      const prepared: any[] = selectedFiles.map((file) => ({ file, attributes: { category: null, type: null, color: null, occasion: 'casual', pattern: null, detection_confidence: 0, detected_items: [] }, detected: null, status: 'pending' }));
      setUploadResults(results);
      setPreparedUploads(prepared);

      // Analyze files sequentially, updating UI as each result arrives
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (cancelled) break;
        if (process.env.NODE_ENV !== 'production') console.log('Processing file (analysis only):', file.name);

        let visionAnalysis: any = null;
        try {
          visionAnalysis = await analyzeClothingImage(file, { signal: abortControllerRef.current?.signal });
        } catch (err) {
          console.error('Vision analysis failed for', file.name, err);
          visionAnalysis = { category: null, color: null, type: null, pattern: null, confidence: 0, detected_items: [] };
        }
        if (cancelled) break;

        // Sanitize category and color to match backend allowed values
        const allowedCategories = ['top', 'bottom', 'shoes', 'accessory', 'dress', 'outerwear', 'hat', 'bag'];
        const allowedColors = ['red','blue','green','yellow','purple','pink','black','white','gray','brown','orange','beige','navy','maroon','teal','olive'];

        const rawCategory = (visionAnalysis?.category || '').toString().toLowerCase().trim();
        const category = allowedCategories.includes(rawCategory) ? rawCategory : 'top';

        const rawColor = (visionAnalysis?.color?.name || visionAnalysis?.color || '')
          .toString()
          .toLowerCase()
          .trim();
        // Attempt to use detected color, fall back to extracting from type string if possible
        let color: string | null = allowedColors.includes(rawColor) ? rawColor : null;

        // Extract the AI-detected type (granular garment name)
        const type = (visionAnalysis?.type || visionAnalysis?.subtype || category || '').toString();

        if (!color) {
          const typeLower = type.toLowerCase();
          for (const c of allowedColors) {
            const re = new RegExp('\\b' + c + '\\b', 'i');
            if (re.test(typeLower)) {
              color = c;
              break;
            }
          }
        }

        if (!color) {
          // Last resort: mark unknown so UI doesn't default to white
          color = 'unknown';
        }

        // Update prepared & results entries
        setPreparedUploads(prev => {
          const copy = [...prev];
          copy[i] = { file, attributes: { category, type, color, occasion: 'casual', pattern: visionAnalysis?.pattern || 'unknown', detection_confidence: (visionAnalysis?.detected_items?.[0]?.confidence || visionAnalysis?.confidence || 0), detected_items: visionAnalysis?.detected_items || [] }, detected: visionAnalysis, status: 'ready' };
          return copy;
        });

        setUploadResults(prev => {
          const copy = [...prev];
          copy[i] = { fileName: file.name, detected: visionAnalysis, uploaded: null, status: 'ready' };
          return copy;
        });
      }
    } catch (err) {
      console.error('Failed to upload clothes:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function finalizeUploads() {
    if (preparedUploads.length === 0) {
      onUploadSuccess();
      onClose();
      return;
    }

    // ensure there is an AbortController for finalization
    if (!abortControllerRef.current) abortControllerRef.current = new AbortController();

    setIsLoading(true);
    const completed: any[] = [];
    let count = 0;
    try {
      for (const p of preparedUploads) {
        if (cancelled) break;
        const formData = new FormData();
        formData.append('image', p.file);
        formData.append('category', p.attributes.category);
        formData.append('type', p.attributes.type || '');
        formData.append('color', p.attributes.color);
        formData.append('occasion', p.attributes.occasion);
        formData.append('pattern', p.attributes.pattern);
        formData.append('detection_confidence', (p.attributes.detection_confidence || 0).toString());
        formData.append('detected_items', JSON.stringify(p.attributes.detected_items || []));

        const res = await uploadWardrobeItem(formData, { signal: abortControllerRef.current.signal });
        count += 1;
        setUploadedCount(count);
        completed.push({ fileName: p.file.name, detected: p.detected, uploaded: res });
      }

      setUploadResults(completed);
      setPreparedUploads([]);
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error('Failed during final upload:', err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-space-grotesk">
              Upload Clothes
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Upload Area */}
          <div className="mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50 mb-4"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium">Click to add clothes</p>
              <p className="text-gray-400 text-sm">Multiple photos supported</p>
            </div>

            {/* Upload Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">📸 Photo Tips for Better AI Detection:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Take photos on a plain background</li>
                <li>• Ensure good lighting and focus on the item</li>
                <li>• Show the full garment clearly</li>
                <li>• Avoid wrinkles or folded items when possible</li>
              </ul>
            </div>

            {/* Upload Limits Display */}
            {typeof uploadLimits !== 'undefined' && uploadLimits && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">📊 Upload Limits:</h4>
                <div className="text-xs text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Daily: {uploadLimits.daily?.current || 0} / {uploadLimits.daily?.max || 0}</span>
                    <span className={uploadLimits.daily?.current >= uploadLimits.daily?.max ? 'text-red-600' : 'text-green-600'}>
                      {uploadLimits.daily?.max - uploadLimits.daily?.current || 0} remaining
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly: {uploadLimits.monthly?.current || 0} / {uploadLimits.monthly?.max || 0}</span>
                    <span className={uploadLimits.monthly?.current >= uploadLimits.monthly?.max ? 'text-red-600' : 'text-green-600'}>
                      {uploadLimits.monthly?.max - uploadLimits.monthly?.current || 0} remaining
                    </span>
                  </div>
                  {!canUploadStatus && (
                    <div className="text-red-600 font-medium mt-2">
                      ⚠️ Upload limit reached. Upgrade to continue uploading.
                    </div>
                  )}
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 mb-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border">
                      <div className="flex items-center min-w-0">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded mr-3 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700 truncate max-w-[12rem]">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isLoading && (
            <div className="mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-gray-500">{uploadedCount}/{selectedFiles.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadedCount / selectedFiles.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-2xl font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isLoading || !canUploadStatus}
              className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                selectedFiles.length > 0 && !isLoading && canUploadStatus
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : !canUploadStatus ? (
                'Limit Reached - Upgrade'
              ) : (
                `Upload ${selectedFiles.length} Item${selectedFiles.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>

          {/* Results Summary (shown after upload completes) */}
          {uploadResults && (
            <div className="mt-6 bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Upload Results</h3>
              <div className="space-y-3 text-sm text-gray-700">
                {uploadResults.map((r, idx) => (
                  <div key={idx} className="p-2 border rounded">
                    <div className="font-medium mb-2">{r.fileName}</div>
                    {r.status === 'pending' ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Analyzing image…</div>
                          <div className="text-xs text-gray-500">AI is processing the image — fields will populate when ready.</div>
                        </div>
                      </div>
                    ) : (
                      (() => {
                        const det = r.detected || {};
                        const confidence = Math.round(((det.confidence || det.detected_items?.[0]?.confidence) || 0) * 100);
                        const type = det.type || det.subtype || det.category || 'unknown';
                        const color = det.color?.name || det.color || 'unknown';
                        const pattern = det.pattern || 'unknown';
                        return (
                          <div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div>
                                <div className="text-xs text-gray-500">Category</div>
                                <div className="font-semibold">{det.category || type}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Color</div>
                                <div className="font-semibold capitalize">{color}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Pattern</div>
                                <div className="font-semibold capitalize">{pattern}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Occasion</div>
                                <div className="font-semibold">{det.occasion || 'casual'}</div>
                              </div>
                            </div>

                            <div className="mb-2">
                              <div className="text-xs text-gray-500">Item Stats</div>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <div className="bg-gray-50 p-2 rounded">Color Match <div className="font-semibold">{confidence}%</div></div>
                                <div className="bg-gray-50 p-2 rounded">Pattern <div className="font-semibold">{pattern}</div></div>
                                <div className="bg-gray-50 p-2 rounded">Category <div className="font-semibold">{det.category || type}</div></div>
                                <div className="bg-gray-50 p-2 rounded">Versatility <div className="font-semibold">75%</div></div>
                                <div className="bg-gray-50 p-2 rounded">Condition <div className="font-semibold">{det.starred ? 'Good' : 'Fair'}</div></div>
                                <div className="bg-gray-50 p-2 rounded">AI Confidence <div className="font-semibold">{confidence}%</div></div>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={async () => {
                    await finalizeUploads();
                  }}
                  disabled={isLoading}
                  className={`ml-auto px-6 py-2 rounded-2xl font-semibold ${
                    isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Done - Save to Wardrobe'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardrobeGrid;
