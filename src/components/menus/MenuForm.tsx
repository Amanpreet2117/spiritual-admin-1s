'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { fetchCategories } from '../../lib/api';
import { Category } from '@/types';

interface MenuItem {
  id: number;
  title: string;
  url: string | null;
  parent_id: number | null;
  order_no: number;
  children?: MenuItem[];
}

interface MenuFormProps {
  initialData?: MenuItem | null;
  allMenus: MenuItem[]; // All menus for parent selection
  onSubmit: (data: Omit<MenuItem, 'id' | 'children'>) => void;
  onCancel: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ initialData, allMenus, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [parentId, setParentId] = useState<string>(initialData?.parent_id?.toString() || '');
  const [orderNo, setOrderNo] = useState<number>(initialData?.order_no || 0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        console.log('MenuForm: Fetched categories:', data);
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    loadCategories();

    console.log('MenuForm: allMenus prop in useEffect:', allMenus);
  }, [allMenus]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url || '');
      setParentId(initialData.parent_id?.toString() || '');
      setOrderNo(initialData.order_no);
      const matchedCategory = categories.find(cat => cat.slug === initialData.url?.replace('/categories/', ''));
      setSelectedCategory(matchedCategory ? matchedCategory.id.toString() : '');
    } else {
      setTitle('');
      setUrl('');
      setParentId('');
      setOrderNo(0);
      setSelectedCategory('');
    }
  }, [initialData, categories]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      const category = categories.find(cat => cat.id.toString() === categoryId);
      if (category) {
        setUrl(`/categories/${category.slug}`); // Auto-populate URL with category slug
      }
    } else {
      setUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      url: url === '' ? null : url,
      parent_id: parentId === '' ? null : parseInt(parentId),
      order_no: orderNo,
    });
  };

  const getParentOptions = (menus: MenuItem[], currentMenuId: number | null = null) => {
    console.log('getParentOptions: Input menus:', menus);
    const options: { value: string; label: string; }[] = [{ value: '', label: 'None (Top Level)' }];

    const buildOptions = (menuItems: MenuItem[], level: number = 0) => {
      menuItems.forEach(menu => {
        if (menu.id === currentMenuId) return; // Don't allow a menu to be its own parent

        options.push({
          value: menu.id.toString(),
          label: '--'.repeat(level) + menu.title,
        });

        if (menu.children && menu.children.length > 0) {
          buildOptions(menu.children, level + 1);
        }
      });
    };

    // Start building options from top-level menus
    const topLevelMenus = menus.filter(menu => menu.parent_id === null || !menus.some(m => m.id === menu.parent_id));
    buildOptions(topLevelMenus, 0);

    console.log('getParentOptions: Generated options:', options);
    return options;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Link to Category</label>
        <Select
          id="category_id"
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={[
            { value: '', label: 'None' },
            ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
          ]}
        />
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL (or auto-generated from category)</label>
        <Input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">Parent Menu</label>
        <Select
          id="parent_id"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          options={getParentOptions(allMenus, initialData?.id)}
        />
      </div>
      <div>
        <label htmlFor="order_no" className="block text-sm font-medium text-gray-700">Order Number</label>
        <Input
          type="number"
          id="order_no"
          value={orderNo}
          onChange={(e) => setOrderNo(parseInt(e.target.value))}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel} variant="outline-secondary">Cancel</Button>
        <Button type="submit">{initialData ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
};

export default MenuForm;
