"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Zod schema for product validation
const productSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  originalPrice: z.number().optional(),
  image: z.string().url('Please enter a valid image URL'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  tags: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
  inStock: z.boolean()
}).refine((data) => {
  if (data.originalPrice && data.originalPrice <= data.price) {
    return false;
  }
  return true;
}, {
  message: "Original price must be greater than current price",
  path: ["originalPrice"]
});

type ProductFormData = z.infer<typeof productSchema>;

const CreateProductPage = () => {
  const [features, setFeatures] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>(['']);
  const [specifications, setSpecifications] = useState<Array<{key: string, value: string}>>([{key: '', value: ''}]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      inStock: true,
      features: [''],
      tags: [''],
      specifications: {}
    }
  });

  const watchedPrice = watch('price');
  const watchedOriginalPrice = watch('originalPrice');

  // Feature management
  const addFeature = () => {
    const newFeatures = [...features, ''];
    setFeatures(newFeatures);
    setValue('features', newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    setValue('features', newFeatures.filter(f => f.trim() !== ''));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    setValue('features', newFeatures.filter(f => f.trim() !== ''));
  };

  // Tag management
  const addTag = () => {
    const newTags = [...tags, ''];
    setTags(newTags);
    setValue('tags', newTags.filter(t => t.trim() !== ''));
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue('tags', newTags.filter(t => t.trim() !== ''));
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
    setValue('tags', newTags.filter(t => t.trim() !== ''));
  };

  // Specification management
  const addSpecification = () => {
    setSpecifications([...specifications, {key: '', value: ''}]);
  };

  const removeSpecification = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
    updateSpecifications(newSpecs);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
    updateSpecifications(newSpecs);
  };

  const updateSpecifications = (specs: Array<{key: string, value: string}>) => {
    const specObject = specs.reduce((acc, spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        acc[spec.key.trim()] = spec.value.trim();
      }
      return acc;
    }, {} as Record<string, any>);
    setValue('specifications', specObject);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Here you would typically send the data to your API
      console.log('Product data:', data);
      
      toast.success('Product created successfully!', {
        style: {
          background: "#10B981",
          color: "#ffffff",
        }
      });
      
      // Reset form
      reset();
      setFeatures(['']);
      setTags(['']);
      setSpecifications([{key: '', value: ''}]);
      
    } catch (error) {
      toast.error('Failed to create product', {
        style: {
          background: "#EF4444",
          color: "#ffffff",
        }
      });
    }
  };

  const discountPercentage = watchedOriginalPrice && watchedPrice 
    ? Math.round(((watchedOriginalPrice - watchedPrice) / watchedOriginalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900">
            Create New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">Product ID *</Label>
                <Input
                  id="id"
                  {...register('id')}
                  className={errors.id ? 'border-red-500' : ''}
                />
                {errors.id && (
                  <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>

            {/* Price Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Current Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  {...register('originalPrice', { valueAsNumber: true })}
                  className={errors.originalPrice ? 'border-red-500' : ''}
                />
                {errors.originalPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.originalPrice.message}</p>
                )}
              </div>

              <div className="flex items-end">
                {discountPercentage > 0 && (
                  <Badge className="bg-green-500 text-white">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Category and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  {...register('category')}
                  className={errors.category ? 'border-red-500' : ''}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  {...register('subcategory')}
                />
              </div>

              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  {...register('brand')}
                />
              </div>
            </div>

            {/* Image and Description */}
            <div>
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                {...register('image')}
                placeholder="https://example.com/image.jpg"
                className={errors.image ? 'border-red-500' : ''}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Features */}
            <div>
              <Label>Features *</Label>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature"
                    />
                    {features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </Button>
              </div>
              {errors.features && (
                <p className="text-red-500 text-sm mt-1">{errors.features.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="space-y-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      placeholder="Enter tag"
                    />
                    {tags.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTag(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Tag
                </Button>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <Label>Specifications</Label>
              <div className="space-y-2">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                      placeholder="Specification name"
                      className="flex-1"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                      placeholder="Specification value"
                      className="flex-1"
                    />
                    {specifications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSpecification}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Specification
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="inStock"
                {...register('inStock')}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setFeatures(['']);
                  setTags(['']);
                  setSpecifications([{key: '', value: ''}]);
                }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProductPage;