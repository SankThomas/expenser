import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Settings as SettingsIcon,
  ChartBarStacked,
  User,
  Globe,
} from "lucide-react";
import DeleteModal from "./DeleteModal";
import CurrencyConverter from "./CurrencyConverter";
import { currencies, getCurrencyByCode } from "../utils/currencies";

const defaultColors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#6b7280",
];

export default function Settings() {
  const { user } = useUser();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(defaultColors[0]);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    category: null,
  });

  const categories = useQuery(
    api.categories.list,
    user?.id ? { userId: user.id } : "skip"
  );
  const defaultCategories = useQuery(api.categories.getDefaultCategories);
  const userData = useQuery(
    api.users.get,
    user?.id ? { userId: user.id } : "skip"
  );
  const createCategory = useMutation(api.categories.create);
  const deleteCategory = useMutation(api.categories.remove);
  const updateUserCurrency = useMutation(api.users.updateCurrency);

  useEffect(() => {
    if (user && categories && categories.length === 0 && defaultCategories) {
      defaultCategories.forEach((category) => {
        createCategory({
          userId: user.id,
          name: category.name,
          color: category.color,
        });
      });
    }
  }, [user, categories, defaultCategories, createCategory]);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!user || !newCategoryName.trim()) return;

    try {
      await createCategory({
        userId: user.id,
        name: newCategoryName.trim(),
        color: newCategoryColor,
      });

      setNewCategoryName("");
      setNewCategoryColor(defaultColors[0]);
    } catch (error) {
      console.error("Error creating category", error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteModal.category) return;

    try {
      await deleteCategory({ id: deleteModal.category._id });
      setDeleteModal({ show: false, category: null });
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  const openDeleteModal = (category) => {
    setDeleteModal({ show: true, category });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, category: null });
  };

  const handleCurrencyChange = async (newCurrency) => {
    if (!user) return;

    try {
      await updateUserCurrency({
        userId: user.id,
        currency: newCurrency,
      });
    } catch (error) {
      console.error("Error updating currency", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-neutral-300">Manage your account and preferences</p>
      </div>

      <div className="bg-transparent rounded-xl p-6 border border-neutral-800 mb-8">
        <div className="flex items-center mb-6">
          <User className="size-6 text-white mr-3" />
          <h2 className="text-xl font-semibold text-white">Profile</h2>
        </div>

        <div className="flex items-center space-x-4">
          <img
            src={user?.imageUrl}
            alt={user?.fullName || "User"}
            className="size-16 rounded-full"
          />
          <div>
            <h3 className="text-white font-medium">
              {user?.fullName || "User"}
            </h3>
            <p className="text-neutral-300">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-transparent rounded-xl p-6 border border-neutral-800 mb-8">
        <div className="flex items-center mb-6">
          <Globe className="size-6 text-white mr-3" />
          <h2 className="text-xl font-semibold text-white">
            Currency Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Currency selection */}
          <div>
            <h3 className="text-white font-medium mb-4">Default Currency</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-200 text-sm font-medium mb-2">
                  Select your preferred currency
                </label>
                <select
                  value={userData?.currency || "USD"}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              {userData?.currency && (
                <div classname="bg-neutral-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300">Current currency:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {getCurrencyByCode(userData.currency).flag}
                      </span>
                      <span className="text-white font-medium">
                        {getCurrencyByCode(userData.currency).name}
                      </span>
                      <span className="text-white font-bold">
                        ({getCurrencyByCode(userData.currency).symbol})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <CurrencyConverter />
          </div>
        </div>
      </div>

      <div className="bg-transparent rounded-xl p-6 border border-neutral-800">
        <div className="flex items-center mb-6">
          <ChartBarStacked className="size-6 text-white mr-3" />
          <h2 className="text-xl font-semibold text-white">
            Expense Categories
          </h2>
        </div>

        <form
          onSubmit={handleAddCategory}
          className="mb-8 p-4 border border-neutral-800 rounded-lg"
        >
          <h3 className="text-white font-medium mb-4">Add New Category</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-200 text-sm font-medium mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-200 text-sm font-medium mb-2">
                Color
              </label>
              <div className="flex items-center space-x-2">
                <div
                  className="size-8 rounded-full border-2 border-neutral-300"
                  style={{
                    backgroundColor: newCategoryColor,
                  }}
                ></div>
                <select
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                >
                  {defaultColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="bg-white hover:bg-white/75 disabled:bg-neutral-600 disabled:text-neutral-400 text-neutral-900 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="size-4" />
                Add Category
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-3">
          <h3 className="text-white font-medium mb-4">You categories</h3>

          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="size-4 rounded-full"
                      style={{
                        backgroundColor: category.color,
                      }}
                    ></div>
                    <span className="text-white font-medium">
                      {category.name}
                    </span>
                  </div>

                  <button
                    onClick={() => openDeleteModal(category)}
                    className="text-neutral-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChartBarStacked className="size-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-300">No custom categories yet</p>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModal.show}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete the ${deleteModal.category?.name} category? This action cannot be undone.`}
      />
    </div>
  );
}
