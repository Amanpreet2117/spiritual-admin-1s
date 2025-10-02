'use client';

import React from 'react';
import { Button } from '../ui/Button';

interface MenuItem {
  id: number;
  title: string;
  url: string | null;
  parent_id: number | null;
  order_no: number;
  children?: MenuItem[];
}

interface MenuTreeViewProps {
  menus: MenuItem[];
  onEdit: (menu: MenuItem) => void;
  onDelete: (id: number) => void;
}

const MenuTreeItem: React.FC<{ menu: MenuItem; onEdit: (menu: MenuItem) => void; onDelete: (id: number) => void; } > = ({ menu, onEdit, onDelete }) => {
  return (
    <li className="mb-2 ">
      <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
        <span className="font-medium">{menu.title} {menu.url && `(${menu.url})`} - Order: {menu.order_no}</span>
        <div>
          <Button variant="outline-secondary" size="sm" onClick={() => onEdit(menu)} className="mr-2">Edit</Button>
          <Button variant="error" size="sm" onClick={() => onDelete(menu.id)}>Delete</Button>
        </div>
      </div>
      {menu.children && menu.children.length > 0 && (
        <ul className="ml-4 mt-2 border-l-2 border-gray-200 pl-4">
          {menu.children.map(child => (
            <MenuTreeItem key={child.id} menu={child} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </li>
  );
};

const MenuTreeView: React.FC<MenuTreeViewProps> = ({ menus, onEdit, onDelete }) => {
  return (
    <ul className="space-y-2">
      {menus.length === 0 ? (
        <p className="text-gray-500">No menu items found. Start by adding a new one!</p>
      ) : (
        menus.map(menu => (
          <MenuTreeItem key={menu.id} menu={menu} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </ul>
  );
};

export default MenuTreeView;
