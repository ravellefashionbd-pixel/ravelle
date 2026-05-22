export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  type: string;
  children: CategoryNode[];
};

export const CATEGORIES: CategoryNode[] = [
  {
    id: "1",
    name: "Perfume",
    slug: "perfume",
    type: "perfume",
    children: [
      {
        id: "1-1",
        name: "Floral",
        slug: "perfume-floral",
        type: "perfume",
        children: [],
      },
      {
        id: "1-2",
        name: "Woody",
        slug: "perfume-woody",
        type: "perfume",
        children: [],
      },
      {
        id: "1-3",
        name: "Oud",
        slug: "perfume-oud",
        type: "perfume",
        children: [],
      },
      {
        id: "1-4",
        name: "Fresh",
        slug: "perfume-fresh",
        type: "perfume",
        children: [],
      },
      {
        id: "1-5",
        name: "Gift Sets",
        slug: "perfume-gift-sets",
        type: "perfume",
        children: [],
      },
    ],
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    type: "clothing",
    children: [
      {
        id: "2-1",
        name: "Men",
        slug: "clothing-men",
        type: "clothing",
        children: [
          {
            id: "2-1-1",
            name: "Jersey",
            slug: "clothing-men-jersey",
            type: "clothing",
            children: [],
          },
          {
            id: "2-1-2",
            name: "T-shirt",
            slug: "clothing-men-tshirt",
            type: "clothing",
            children: [],
          },
          {
            id: "2-1-3",
            name: "Panjabi",
            slug: "clothing-men-panjabi",
            type: "clothing",
            children: [],
          },
          {
            id: "2-1-4",
            name: "Shirt",
            slug: "clothing-men-shirt",
            type: "clothing",
            children: [],
          },
          {
            id: "2-1-5",
            name: "Pant",
            slug: "clothing-men-pant",
            type: "clothing",
            children: [],
          },
          {
            id: "2-1-6",
            name: "Suits",
            slug: "clothing-men-suits",
            type: "clothing",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Cosmetics",
    slug: "cosmetics",
    type: "cosmetics",
    children: [
      {
        id: "3-1",
        name: "Skincare",
        slug: "cosmetics-skincare",
        type: "cosmetics",
        children: [],
      },
      {
        id: "3-2",
        name: "Haircare",
        slug: "cosmetics-haircare",
        type: "cosmetics",
        children: [],
      },
      {
        id: "3-3",
        name: "Grooming",
        slug: "cosmetics-grooming",
        type: "cosmetics",
        children: [],
      },
      {
        id: "3-4",
        name: "Makeup",
        slug: "cosmetics-makeup",
        type: "cosmetics",
        children: [],
      },
    ],
  },
  {
    id: "4",
    name: "Watches",
    slug: "watches",
    type: "watches",
    children: [
      {
        id: "4-1",
        name: "Men",
        slug: "watches-men",
        type: "watches",
        children: [],
      },
      {
        id: "4-2",
        name: "Women",
        slug: "watches-women",
        type: "watches",
        children: [],
      },
      {
        id: "4-3",
        name: "Smartwatch",
        slug: "watches-smartwatch",
        type: "watches",
        children: [],
      },
      {
        id: "4-4",
        name: "Vintage",
        slug: "watches-vintage",
        type: "watches",
        children: [],
      },
    ],
  },
];
