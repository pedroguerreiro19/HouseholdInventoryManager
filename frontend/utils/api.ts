import { Item } from '../types/models';

const BASE_URL = "http://localhost:4000/api";

// USERS
export const createUser = async (userData: any) => {
  const res = await fetch(`${BASE_URL}/users/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (credentials: any) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

export const getUserById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  return res.json();
};

export async function changeUserPassword(userId: string, oldPassword: string, newPassword: string, token: string) {
  const response = await fetch(`${BASE_URL}/users/${userId}/changePassword`, {
    method: "PUT",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': "application/json", 
    },
    body:JSON.stringify({currentPassword: oldPassword, newPassword}),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to change password");
  }

  const data = await response.json();
  return data;
}

export async function editUser(userId: string, updatedData: {name?:string; email?: string}, token:string) {
  const response = await fetch(`${BASE_URL}/users/${userId}/edit`, {
    method: "PUT",
    headers: {
      'Authorization' : `Bearer ${token}`,
      'Content-Type': "application/json",
    },
    body:JSON.stringify(updatedData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to edit user");
  }

  const data = await response.json();
  return data.user;
}

export async function deleteUser(userId: string, token: string) {
  const response = await fetch (`${BASE_URL}/users/${userId}/delete`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete account");
  }

  return await response.json();
}

// GROUPS
export const createGroup = async (groupData: any, token: string) => {
  const res = await fetch(`${BASE_URL}/groups/create`, {
    method: "POST",
    headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' },
    body: JSON.stringify(groupData),
  });
  return res.json();
};

export const joinGroup = async (groupData: any, token:string) => {
  const res = await fetch(`${BASE_URL}/groups/join`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' },
      body: JSON.stringify(groupData),
  });
  return res.json();
};

export const getGroupMembers = async (groupId: string, token: string) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'},
  })
  return res.json();
}

export const getGroupById = async (groupId: string, token: string) => {
  const res = await fetch(`${BASE_URL}/groups/getgroup/${groupId}`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch group.");
  return res.json();
};

// ITEMS
export const getItemsByGroup = async (groupId: any, token: string): Promise<Item[]> => {
  const res = await fetch(`${BASE_URL}/items/group/${groupId}`,{
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });
  return res.json();
};

export const getItemsByUser = async (userId: string, token: string): Promise<Item[]> => {
  const res = await fetch(`${BASE_URL}/items/user/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch items for user.");
  return res.json();
}

export const createItem = async (itemData: any, token: string) => {
  const res = await fetch(`${BASE_URL}/items/create`, {
    method: "POST",
    headers: { 
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json" ,
    },
    body: JSON.stringify(itemData),
  });
  return res.json();
};

export const deleteItem = async (itemId: string, token:string) => {
  const res = await fetch(`${BASE_URL}/items/delete/${itemId}`,{
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to delete item.");
}