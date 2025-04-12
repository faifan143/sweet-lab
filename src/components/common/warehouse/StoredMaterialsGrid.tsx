const StoredMaterialsGrid = ({
  materials,
}: {
  materials: Array<{
    itemId: number;
    itemName: string;
    totalQuantity: number;
    totalCost: number;
    averageUnitPrice: number;
    item?: {
      description?: string;
      units?: Array<{ unit: string; price: number }>;
    };
  }>;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {materials.map((material) => (
      <div
        key={material.itemId}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg hover:bg-white/10 transition-all duration-300 ease-in-out"
      >
        <div className="flex flex-col h-full">
          {/* Material Name */}
          <h3 className="text-xl font-bold text-white mb-4">
            {material.itemName}
          </h3>

          {/* Material Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-sm text-gray-400">الكمية</p>
              <p className="text-white font-medium">
                {material.totalQuantity}
                <span className="text-xs text-gray-400 mx-1">وحدة</span>
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">متوسط السعر</p>
              <p className="text-white font-medium">
                {material.averageUnitPrice.toFixed(2)}
                <span className="text-xs text-gray-400 mx-1">ر.س</span>
              </p>
            </div>
          </div>

          {/* Total Cost */}
          <div className="mt-auto">
            <div className="bg-purple-500/10 rounded-lg p-3">
              <p className="text-sm text-gray-400">إجمالي التكلفة</p>
              <p className="text-purple-400 font-bold text-lg">
                {material.totalCost.toFixed(2)} ر.س
              </p>
            </div>
          </div>

          {/* Additional Details (optional) */}
          {material.item?.description && (
            <div className="text-sm text-gray-300 mt-3 italic">
              {material.item.description}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default StoredMaterialsGrid;
