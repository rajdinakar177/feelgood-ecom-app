// app/lib/utils/categoryTree.ts
export function buildCategoryTree(categories: any[]): any[] {
  const map: Record<string, any> = {};
  const roots: any[] = [];

  categories.forEach((c) => {
    map[c._id] = { ...c, children: [] };
  });

  categories.forEach((c) => {
    if (c.parentId?._id || c.parentId) {
      const parentId = c.parentId?._id ?? c.parentId;
      if (map[parentId]) {
        map[parentId].children.push(map[c._id]);
      }
    } else {
      roots.push(map[c._id]);
    }
  });

  return roots;
}