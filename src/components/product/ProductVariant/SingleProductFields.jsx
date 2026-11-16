const SingleProductFields = ({ register, errors, watch }) => {

    const taxType = watch ? watch("taxType") : "";
    const isTaxInclusive = taxType === "exclusive";
    const discountType = watch ? watch("discountType") : "";

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stock Status Selection */}
            <div>
                <label className="block text-sm font-medium">Stock Status <span className="text-rose-500">*</span></label>
                <select
                    {...register("stockStatus")}
                    defaultValue="IN_STOCK"
                    className="select select-bordered pl-3 pr-3 py-2 bg-white border border-gray-300 rounded w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition mt-2 font-medium"
                >
                    <option value="IN_STOCK">🟢 In Stock (স্টকে আছে)</option>
                    <option value="OUT_OF_STOCK">🔴 Out of Stock (স্টক শেষ)</option>
                    <option value="PRE_ORDER">🟡 Pre-Order (অগ্রিম বুকিং)</option>
                </select>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">
                        Stock Tracking
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer bg-slate-50 border border-slate-200 px-2 py-1 rounded hover:bg-slate-100 transition">
                        <input
                            type="checkbox"
                            {...register("trackQuantity")}
                            className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer w-3.5 h-3.5"
                        />
                        <span>Track stock count</span>
                    </label>
                </div>

                <div className="mt-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Quantity / Stock Units
                    </label>
                    <input
                        {...register("quantity", {
                            valueAsNumber: true,
                            validate: (val) => {
                                if (val !== undefined && val !== null && !isNaN(val) && val < 0) {
                                    return "Quantity cannot be negative";
                                }
                                return true;
                            }
                        })}
                        type="number"
                        min="0"
                        placeholder="Enter Stock Quantity (e.g. 50)"
                        className="pl-3 pr-3 py-2 bg-white border border-gray-300 rounded w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition"
                    />
                    {errors.quantity && (
                        <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
                    )}
                    <p className="text-[11px] text-gray-500 mt-1">
                        Enter current available inventory to track and manage stock
                    </p>
                </div>
            </div>

            {/* Pre-Order Custom Note (if Pre-Order selected) */}
            <div>
                <label className="block text-sm font-medium">Pre-Order Note <span className="text-xs text-gray-500">(if pre-order)</span></label>
                <input
                    {...register("preOrderMessage")}
                    type="text"
                    placeholder="e.g. ডেলিভারি ৭-১০ কার্যদিবসের মধ্যে"
                    className="pl-3 pr-3 py-2 bg-white border border-gray-300 rounded w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition mt-2"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                    Displayed to customers on product page & button
                </p>
            </div>

            {/* Regular Price (মূল দাম / আগের দাম) */}
            <div>
                <label className="block text-sm font-medium">
                    Regular Price (মূল্য) <span className="text-rose-500">*</span>
                </label>
                <input
                    {...register("regularPrice", {
                        required: "Regular price is required",
                        valueAsNumber: true,
                        min: {
                            value: 0.01,
                            message: "Regular price must be greater than 0"
                        }
                    })}
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1200"
                    className="pl-3 pr-3 py-2 bg-white border border-gray-300 rounded w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition mt-2 font-medium"
                />
                {errors.regularPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.regularPrice.message}</p>
                )}
                <p className="text-[11px] text-gray-500 mt-1">
                    Original MRP price shown with strikethrough if selling price is lower
                </p>
            </div>

            {/* Selling Price (বিক্রয় মূল্য) */}
            <div>
                <label className="block text-sm font-medium">
                    Selling Price (বিক্রয় মূল্য) <span className="text-rose-500">*</span>
                </label>
                <input
                    {...register("sellingPrice", {
                        required: "Selling price is required",
                        valueAsNumber: true,
                        min: {
                            value: 0.01,
                            message: "Selling price must be greater than 0"
                        },
                        validate: (val) => {
                            const reg = watch ? parseFloat(watch("regularPrice")) : null;
                            if (reg && val > reg) {
                                return "Selling price cannot be greater than Regular Price";
                            }
                            return true;
                        }
                    })}
                    type="number"
                    step="0.01"
                    placeholder="e.g. 990"
                    className="pl-3 pr-3 py-2 bg-white border border-gray-300 rounded w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition mt-2 font-bold text-gray-900"
                />
                {errors.sellingPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.sellingPrice.message}</p>
                )}
                {(() => {
                    const reg = watch ? parseFloat(watch("regularPrice")) : 0;
                    const sell = watch ? parseFloat(watch("sellingPrice")) : 0;
                    if (reg > 0 && sell > 0 && reg > sell) {
                        const discount = Math.round(reg - sell);
                        const percent = Math.round(((reg - sell) / reg) * 100);
                        return (
                            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                                Discount: ৳{discount} ({percent}% ছাড়)
                            </p>
                        );
                    }
                    return null;
                })()}
            </div>

            <div>
                <label className="block text-sm font-medium">Unit Cost (Buying Price)</label>
                <input
                    {...register("costPrice", {
                        valueAsNumber: true,
                        min: {
                            value: 0,
                            message: "Cost price cannot be negative"
                        }
                    })}
                    type="number"
                    step="0.01"
                    placeholder="e.g. 500 (for accurate profit)"
                    className="pl-3 pr-3 py-2 bg-white border border-gray-300 rounded w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition mt-2"
                />
                {errors.costPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.costPrice.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">Tax Type <span className="text-rose-500">*</span></label>
                <select
                    {...register("taxType", { required: "Tax type is required" })}
                    className="select select-bordered  pl-3 pr-3 py-2 bg-white border border-gray-300 rounded w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition mt-2"
                >
                    <option value="">Select</option>
                    <option value="inclusive">Inclusive</option>
                    <option value="exclusive">Exclusive</option>
                </select>
                {errors.taxType && (
                    <p className="text-red-500 text-xs mt-1">{errors.taxType.message}</p>
                )}
            </div>

            {/* Tax field - conditionally rendered */}
            {isTaxInclusive && (
                <div>
                    <label className="block text-sm font-medium">Tax (%) <span className="text-rose-500">*</span></label>
                    <input
                        {...register("tax", {
                            required: "Tax is required",
                            valueAsNumber: true
                        })}
                        type="number"
                        step="0.01"
                        placeholder="Enter Tax (%)"
                    />
                    {errors.tax && (
                        <p className="text-red-500 text-xs mt-1">{errors.tax.message}</p>
                    )}
                </div>
            )}

            <div className="">
                <label className="block text-sm font-medium">Quantity Alert <span className="text-xs font-normal">(optional)</span></label>
                <input
                    {...register("quantityAlert", {
                        valueAsNumber: true
                    })}
                    type="number"
                    placeholder="Enter Quantity Alert"
                    className="pl-3 pr-3 py-2 bg-white border border-gray-300 rounded w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition mt-2"
                />
            </div>
        </div>
    );
};

export default SingleProductFields;