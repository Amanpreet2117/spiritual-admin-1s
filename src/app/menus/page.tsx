'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import MenuForm from '../../components/menus/MenuForm';
import MenuTreeView from '../../components/menus/MenuTreeView';
import { fetchMenus, createMenu, updateMenu, deleteMenu } from '../../lib/api';

interface MenuItem {
  id: number;
  title: string;
  url: string | null;
  parent_id: number | null;
  order_no: number;
  children?: MenuItem[];
}

const MenusPage: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadMenus = async () => {
    try {
      const data = await fetchMenus();
      setMenus(data || []); // Ensure data is always an array
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const handleCreateOrUpdate = async (menuData: Omit<MenuItem, 'id' | 'children'>) => {
    try {
      if (editingMenu) {
        await updateMenu(editingMenu.id, menuData);
      } else {
        await createMenu(menuData);
      }
      await loadMenus();
      setIsModalOpen(false);
      setEditingMenu(null);
    } catch (error) {
      console.error('Failed to save menu:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this menu item and all its children?')) {
      try {
        await deleteMenu(id);
        await loadMenus();
      } catch (error) {
        console.error('Failed to delete menu:', error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  const openEditModal = (menu: MenuItem) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>
      <Button onClick={openCreateModal} className="mb-4">Add New Menu Item</Button>

      <Card className="p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Existing Menus</h2>
        <MenuTreeView menus={menus} onEdit={openEditModal} onDelete={handleDelete} />
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">{editingMenu ? 'Edit Menu Item' : 'Create New Menu Item'}</h3>
            <MenuForm
              initialData={editingMenu}
              allMenus={menus} // Pass all menus for parent selection
              onSubmit={handleCreateOrUpdate}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MenusPage;
