"use client";

import { create } from "zustand";

export type DrawerPlacements = "left" | "right" | "top" | "bottom";

export type DrawerState = {
  isOpen: boolean;
  view: React.ReactNode;
  placement: DrawerPlacements;
  customSize: string;
  openDrawer: (options: {
    view: React.ReactNode;
    placement: DrawerPlacements;
    customSize?: string;
  }) => void;
  closeDrawer: () => void;
};

const useDrawer = create<DrawerState>((set) => ({
  isOpen: false,
  view: null,
  placement: "right",
  customSize: "320px",
  openDrawer: ({
    view,
    placement,
    customSize,
  }: {
    view: React.ReactNode;
    placement: DrawerPlacements;
    customSize?: string;
  }) => {
    set((state) => ({
      ...state,
      isOpen: true,
      view,
      placement,
      customSize,
    }));
  },
  closeDrawer: () => {
    set((state) => ({
      ...state,
      isOpen: false,
    }));
  },
}));

export default useDrawer;
