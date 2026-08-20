import { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Button,
  useTheme,
  alpha,
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Switch,
  FormControlLabel,
  FormGroup,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

import { motion, AnimatePresence } from 'framer-motion';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import CloseIcon from '@mui/icons-material/Close';
import EggAlertOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import SoupKitchenOutlinedIcon from '@mui/icons-material/SoupKitchenOutlined';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { commonTokens } from '../theme/tokens';
import { addDish, deleteDish, getDishes, updateDish } from '../services/dishes';
import { getCategories } from '../services/categories';
import { getIngredients } from '../services/ingredients';
import { getAllergens } from '../services/allergens';
import { getTags } from '../services/tags';

/* =============================================================
   SOURCE DATA
============================================================= */

const CATEGORY_ACCENTS = {
  Starters: '#2E7D5B',
  'Main Course': '#B5472B',
  Desserts: '#A5722E',
  Drinks: '#6B4A9E',
  "Chef's Specials": '#B0862B',
};

const getCategoryAccent = (category) =>
  CATEGORY_ACCENTS[category] || '#6B6B6B';

const parsePrice = (value) => {
  if (!value) return 0;

  const numeric = String(value).replace(
    /[^0-9.]/g,
    ''
  );

  return numeric ? parseFloat(numeric) : 0;
};

const formatPrice = (value) => {
  const trimmed = String(value ?? '').trim();

  if (!trimmed) return '';

  return trimmed.startsWith('Rs. ')
    ? trimmed
    : `Rs. ${trimmed}/-`;
};

/* =============================================================
   EMPTY FORM
============================================================= */

const emptyForm = {
  name: '',
  category: '',
  price: '',
  dealPrice: '',
  hotDeal: false,
  featured: false,
  shortDescription: '',
  description: '',
  ingredients: [],
  allergens: [],
  images: [],
  tags: [],
  chefRecommendation: '',
  dealItems: [],
};

const Products = () => {
  const theme = useTheme();

  /* =========================================================
     MENU ITEMS
  ========================================================= */

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [tags, setTags] = useState([]);

  /* =========================================================
     FILTER STATE
  ========================================================= */

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [dealFilter, setDealFilter] = useState('All');

  /* =========================================================
     FORM MODAL STATE
  ========================================================= */

  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  /* =========================================================
     DETAIL MODAL STATE
  ========================================================= */

  const [viewItem, setViewItem] = useState(null);
  const [viewImageIndex, setViewImageIndex] = useState(0);

  /* =========================================================
     IMAGE HELPERS
  ========================================================= */

  const INGREDIENT_OPTIONS = [
    ...new Set(
      items.flatMap(
        (item) => item.ingredients || []
      )
    ),
  ];

  const ALLERGEN_OPTIONS = [
    ...new Set(
      items.flatMap(
        (item) => item.allergens || []
      )
    ),
  ];

  const getImageSrc = (image) => {
    if (!image) return '';

    if (typeof image === 'string') {
      return image;
    }

    if (image.preview) {
      return image.preview;
    }

    if (image.file) {
      return URL.createObjectURL(image.file);
    }

    if (image.src) {
      return image.src;
    }

    return '';
  };

  const normalizeImages = (images = []) => {
    return images
      .filter(Boolean)
      .map((image, index) => {
        if (typeof image === 'string') {
          return {
            id: `existing-${index}-${image}`,
            src: image,
            file: null,
            name: `Image ${index + 1}`,
          };
        }

        return image;
      });
  };

  const addImages = (files) => {
    const selectedFiles = Array.from(files || []);

    if (!selectedFiles.length) return;

    const validFiles = selectedFiles.filter(
      (file) => file.type.startsWith('image/')
    );

    if (!validFiles.length) {
      setFormErrors((previous) => ({
        ...previous,
        images: 'Please select valid image files.',
      }));

      return;
    }

    const newImages = validFiles.map(
      (file, index) => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}-${index}`,
        src: URL.createObjectURL(file),
        preview: URL.createObjectURL(file),
        file,
        name: file.name,
      })
    );

    setFormData((previous) => ({
      ...previous,
      images: [
        ...previous.images,
        ...newImages,
      ],
    }));

    setFormErrors((previous) => ({
      ...previous,
      images: '',
    }));
  };

  const removeImage = (imageId) => {
    setFormData((previous) => ({
      ...previous,
      images: previous.images.filter(
        (image) => image.id !== imageId
      ),
    }));
  };

  const moveImage = (fromIndex, toIndex) => {
    setFormData((previous) => {
      const updatedImages = [
        ...previous.images,
      ];

      const [movedImage] =
        updatedImages.splice(fromIndex, 1);

      updatedImages.splice(
        toIndex,
        0,
        movedImage
      );

      return {
        ...previous,
        images: updatedImages,
      };
    });
  };

  /* =========================================================
     DRAG & DROP STATE
  ========================================================= */

  const [isDraggingImages, setIsDraggingImages] =
    useState(false);

  const handleImageDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDraggingImages(true);
  };

  const handleImageDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDraggingImages(true);
  };

  const handleImageDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      event.currentTarget ===
      event.target
    ) {
      setIsDraggingImages(false);
    }
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDraggingImages(false);

    const files =
      event.dataTransfer?.files;

    addImages(files);
  };

  const handleImageInputChange = (
    event
  ) => {
    addImages(event.target.files);

    event.target.value = '';
  };

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query =
        searchQuery.toLowerCase();

      const matchesSearch =
        item?.name?.toLowerCase()?.includes(query) ||
        item?.category?.toLowerCase()?.includes(query) ||
        item?.shortDescription?.toLowerCase()?.includes(query);

      const matchesCategory =
        category === 'All' ||
        item.category === category;

      let matchesDeal = true;

      if (dealFilter === 'Hot Deals') {
        matchesDeal = Boolean(
          item.hotDeal
        );
      }

      if (dealFilter === 'Featured') {
        matchesDeal = Boolean(
          item.featured
        );
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDeal
      );
    });
  }, [
    items,
    searchQuery,
    category,
    dealFilter,
  ]);

  const stats = useMemo(
    () => ({
      total: items.length,
      featured: items.filter(
        (item) => item.featured
      ).length,
      hotDeals: items.filter(
        (item) => item.hotDeal
      ).length,
      categories: new Set(
        items.map(
          (item) => item.category
        )
      ).size,
    }),
    [items]
  );

  /* =========================================================
     FORM HELPERS
  ========================================================= */

  const openAddForm = () => {
    setFormErrors({});
    setEditingId(null);

    setFormData({
      ...emptyForm,
      images: [],
      ingredients: [],
      allergens: [],
      dealItems: [],
    });

    setIsDraggingImages(false);
    setOpenForm(true);
  };

  const openEditForm = (item) => {
    setFormErrors({});
    setEditingId(item.id);

    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.replace('$', ''),
      dealPrice: item.dealPrice
        ? item.dealPrice.replace('$', '')
        : '',
      hotDeal: Boolean(item.hotDeal),
      featured: Boolean(item.featured),
      shortDescription:
        item.shortDescription,
      description:
        item.description,

      ingredients: Array.isArray(
        item.ingredients
      )
        ? [...item.ingredients]
        : [],

      allergens: Array.isArray(
        item.allergens
      )
        ? [...item.allergens]
        : [],

      images: normalizeImages(
        item.images || []
      ),

      tags: item.tags || [],
      chefRecommendation:
        item.chefRecommendation || '',

      // NEW
      dealItems: Array.isArray(item.dealItems)
        ? [...item.dealItems]
        : [],
    });

    setIsDraggingImages(false);
    setOpenForm(true);
  };

  const closeForm = () => {
    setOpenForm(false);
    setFormErrors({});
    setEditingId(null);
    setIsDraggingImages(false);

    setFormData({
      ...emptyForm,
      images: [],
      ingredients: [],
      allergens: [],
      dealItems: [],
    });
  };

  const handleFormChange = (event) => {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));

    if (formErrors[name]) {
      setFormErrors((previous) => ({
        ...previous,
        [name]: '',
      }));
    }
  };

  /* =========================================================
     TAGS
  ========================================================= */

  const toggleTag = (tag) => {
    setFormData((previous) => {
      const has = previous?.tags?.includes(tag);

      const updatedTags = has
        ? previous.tags.filter(
          (entry) => entry !== tag
        )
        : [
          ...previous.tags,
          tag,
        ];

      // Clear tags validation error
      if (
        updatedTags.length > 0 &&
        formErrors.tags
      ) {
        setFormErrors((previousErrors) => ({
          ...previousErrors,
          tags: '',
        }));
      }

      return {
        ...previous,
        tags: updatedTags,
      };
    });
  };

  /* =========================================================
     INGREDIENTS
  ========================================================= */

  const toggleIngredient = (ingredient) => {
    setFormData((previous) => {
      const has = previous?.ingredients?.includes(ingredient);

      const updatedIngredients = has
        ? previous.ingredients.filter(
          (entry) => entry !== ingredient
        )
        : [
          ...previous.ingredients,
          ingredient,
        ];

      // Clear error once at least one ingredient is selected
      if (updatedIngredients.length > 0 && formErrors.ingredients) {
        setFormErrors((previousErrors) => ({
          ...previousErrors,
          ingredients: '',
        }));
      }

      return {
        ...previous,
        ingredients: updatedIngredients,
      };
    });
  };

  /* =========================================================
     ALLERGENS
  ========================================================= */

  const toggleAllergen = (allergen) => {
    setFormData((previous) => {
      const has = previous?.allergens?.includes(allergen);

      const updatedAllergens = has
        ? previous.allergens.filter(
          (entry) => entry !== allergen
        )
        : [
          ...previous.allergens,
          allergen,
        ];

      // Clear allergens validation error
      if (
        updatedAllergens.length > 0 &&
        formErrors.allergens
      ) {
        setFormErrors((previousErrors) => ({
          ...previousErrors,
          allergens: '',
        }));
      }

      return {
        ...previous,
        allergens: updatedAllergens,
      };
    });
  };

  /* =========================================================
     DEAL ITEMS
     
     A deal can contain one or more existing
     menu items.
  ========================================================= */

  const toggleDealItem = (itemId) => {
    setFormData((previous) => {
      const has =
        previous?.dealItems?.includes(itemId);

      const updatedDealItems = has
        ? previous.dealItems.filter(
          (id) => id !== itemId
        )
        : [
          ...previous.dealItems,
          itemId,
        ];

      return {
        ...previous,
        dealItems: updatedDealItems,
      };
    });

    if (formErrors.dealItems) {
      setFormErrors((previous) => ({
        ...previous,
        dealItems: '',
      }));
    }
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Dish name is required.';
    }

    if (!formData.category.trim()) {
      errors.category = 'Category is required.';
    }

    if (!formData.shortDescription.trim()) {
      errors.shortDescription = 'A short description is required.';
    }

    if (!formData.price.trim()) {
      errors.price = 'Price is required.';
    }

    /* =======================================================
       NEW DEAL VALIDATION
       
       A Hot Deal must contain at least
       one existing menu item.
    ======================================================= */

    // if (items.length > 0) {
    //   if (
    //     formData.hotDeal &&
    //     (!Array.isArray(formData.dealItems) ||
    //       formData.dealItems.length === 0)
    //   ) {
    //     errors.dealItems =
    //       'Please add at least one dish to this deal.';
    //   }
    // }


    if (
      !formData.images ||
      formData.images.length === 0
    ) {
      errors.images =
        'At least one dish image is required.';
    }

    if (formData.ingredients.length <= 0) {
      errors.ingredients = 'Select atleast one ingredient'
    }

    if (formData.allergens.length <= 0) {
      errors.allergens = 'Select at least one allergen';
    }

    if (formData.tags.length <= 0) {
      errors.tags = 'Select at least one tag';
    }

    setFormErrors(errors);

    return (
      Object.keys(errors).length === 0
    );
  };

  /* =========================================================
     SAVE / UPDATE DISH
  ========================================================= */

  const handleSaveItem = async () => {
    if (!validateForm()) return;

    const normalizedImages = (formData.images || [])
      .map((image) => {
        if (typeof image === "string") {
          return image;
        }

        return image?.src || image?.preview;
      })
      .filter(Boolean);

    const payload = {
      name: formData.name.trim(),

      category: formData.category.trim(),

      price: formatPrice(formData.price),

      dealPrice: formData.hotDeal
        ? formatPrice(formData.dealPrice)
        : null,

      hotDeal: Boolean(formData.hotDeal),

      featured: Boolean(formData.featured),

      shortDescription:
        formData.shortDescription.trim(),

      description:
        formData.description.trim() ||
        formData.shortDescription.trim(),

      ingredients: [
        ...(formData.ingredients || []),
      ],

      allergens: [
        ...(formData.allergens || []),
      ],

      images: normalizedImages,

      tags: [
        ...(formData.tags || []),
      ],

      chefRecommendation:
        formData.chefRecommendation?.trim() || null,

      dealItems: formData.hotDeal
        ? [...(formData.dealItems || [])]
        : [],
    };

    const isEditing = editingId !== null;

    const itemId = isEditing
      ? editingId
      : `${payload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    const item = {
      id: itemId,
      ...payload,
    };

    try {
      setLoading(true);

      const response = isEditing
        ? await updateDish(itemId, item)
        : await addDish(item);

      if (!response?.success) {
        setToast({
          open: true,
          severity: "error",
          message:
            response?.error ||
            response?.message ||
            `Failed to ${isEditing ? "update" : "add"
            } dish.`,
        });

        return;
      }

      // Always get the latest Firestore data
      setLoading(true);
      fetchAndDisplayCatgories()
        .then(() => fetchAndDisplayDishes()
          .then(() => fetchAndDisplayIngredients())
          .then(() => fetchAndDisplayAllergens())
          .then(() => fetchAndDisplayTags()))
        .finally(() => {
          setLoading(false);
        });

      setToast({
        open: true,
        severity: "success",
        message: isEditing
          ? "Dish updated successfully."
          : "Dish added successfully.",
      });

      closeForm();

    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"
        } dish:`,
        error
      );

      setToast({
        open: true,
        severity: "error",
        message:
          error?.message ||
          `Something went wrong while ${isEditing ? "updating" : "adding"
          } the dish.`,
      });

    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     DELETE DISH
  ========================================================= */

  const handleDeleteItem = (id) => {
    setDeleteItemId(id);
  };

  const confirmDeleteItem = async () => {
    try {
      if (!deleteItemId) return;

      setLoading(true);
      const res = await deleteDish(deleteItemId);

      if (res?.success === true) {
        setItems((previous) =>
          previous
            .filter((item) => item.id !== deleteItemId)
            .map((item) => ({
              ...item,
              dealItems: Array.isArray(item.dealItems)
                ? item.dealItems.filter(
                  (dealItemId) => dealItemId !== deleteItemId
                )
                : [],
            }))
        );

        setToast({
          open: true,
          severity: 'success',
          message: 'Dish deleted successfully.',
        });

        closeForm();
        if (viewItem && viewItem.id === deleteItemId) {
          closeDetail();
        }

        setDeleteItemId(null);
        return;
      }

      setToast({
        open: true,
        severity: 'error',
        message:
          res?.error ||
          res?.message ||
          'Unable to delete this dish.',
      });

      if (viewItem && viewItem.id === deleteItemId) {
        closeDetail();
      }

      setDeleteItemId(null);
    } catch (error) {
      console.error('Error adding dish:', error);

      setToast({
        open: true,
        severity: 'error',
        message:
          error?.message ||
          'Something went wrong while removing the dish.',
      });
    } finally {
      setLoading(false);
    }


  };

  const cancelDeleteItem = () => {
    setDeleteItemId(null);
  };

  /* =========================================================
     DETAIL VIEW
  ========================================================= */

  const openDetail = (item) => {
    setViewItem(item);
    setViewImageIndex(0);
  };

  const closeDetail = () => {
    setViewItem(null);
    setViewImageIndex(0);
  };


  const fetchAndDisplayCatgories = async () => {
    const categoriesData = await getCategories();
    if (categoriesData.success) {
      setCategories(categoriesData.data);
    }
  }

  const fetchAndDisplayDishes = async () => {
    const dishesData = await getDishes();
    if (dishesData.success) {
      setItems(dishesData.data);
    }
  }

  const fetchAndDisplayIngredients = async () => {
    const ingredientsData = await getIngredients();
    if (ingredientsData.success) {
      setIngredients(ingredientsData.data);
    }
  }

  const fetchAndDisplayAllergens = async () => {
    const allergensData = await getAllergens();
    if (allergensData.success) {
      setAllergens(allergensData.data);
    }
  }
  const fetchAndDisplayTags = async () => {
    const tagsData = await getTags();
    if (tagsData.success) {
      setTags(tagsData.data);
    }

  }

  useEffect(() => {
    setLoading(true);
    fetchAndDisplayCatgories()
      .then(() => fetchAndDisplayDishes()
        .then(() => fetchAndDisplayIngredients())
        .then(() => fetchAndDisplayAllergens())
        .then(() => fetchAndDisplayTags()))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            justifyContent:
              'space-between',
            gap: 2,
            marginBottom: {
              xs: 3,
              md: 4,
            },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing:
                  '-0.5px',
                fontSize: {
                  xs: '1.7rem',
                  sm: '2rem',
                  md: '2.2rem',
                },
                marginBottom: 0.75,
              }}
            >
              Menu
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
              }}
            >
              Manage every dish on the
              Pastizza menu, from
              starters to Chef's
              Specials.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddForm}
            fullWidth
            sx={{
              width: {
                xs: '100%',
                sm: 'auto',
              },
              minHeight: 44,
              px: 2.5,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: `0 8px 20px ${alpha(
                theme.palette.primary.main,
                0.22
              )}`,
              '&:hover': {
                transform:
                  'translateY(-2px)',
              },
              transition:
                'all 0.25s ease',
            }}
          >
            Add Dish
          </Button>
        </Box>
      </motion.div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2,
          md: 3,
        }}
        sx={{
          width: '100%',
          margin: 0,
          mb: {
            xs: 3,
            sm: 4,
            md: commonTokens.spacing.xxxl,
          },
        }}
      >
        {[
          {
            label: 'Total Dishes',
            value: stats.total,
            icon: (
              <RestaurantMenuOutlinedIcon />
            ),
            color:
              theme.palette.primary
                .main,
          },
          {
            label: 'Featured',
            value: stats.featured,
            icon: <StarRoundedIcon />,
            color:
              theme.palette.warning
                .main,
          },
          {
            label: 'Hot Deals',
            value: stats.hotDeals,
            icon: (
              <LocalFireDepartmentIcon />
            ),
            color:
              theme.palette.error
                .main,
          },
          {
            label: 'Categories',
            value: stats.categories,
            icon: (
              <CategoryOutlinedIcon />
            ),
            color:
              theme.palette.success
                .main,
          },
        ].map((stat) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
            sx={{
              minWidth: 0,
            }}
            key={stat.label}
          >
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(
                  stat.color,
                  0.1
                )}, ${alpha(
                  stat.color,
                  0.03
                )})`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {stat.label}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        mt: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      backgroundColor:
                        alpha(
                          stat.color,
                          0.12
                        ),
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <Card
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          mb: {
            xs: 3,
            md: 4,
          },
        }}
      >
        <CardContent>
          <Grid
            container
            spacing={2}
          >
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search dishes..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel>
                  Category
                </InputLabel>

                <Select
                  value={category}
                  label="Category"
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  {categories.map(
                    (item) => (
                      <MenuItem
                        key={item?.id}
                        value={item?.name}
                      >
                        {item?.name}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel>
                  Show
                </InputLabel>

                <Select
                  value={dealFilter}
                  label="Show"
                  onChange={(event) =>
                    setDealFilter(
                      event.target.value
                    )
                  }
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="All">
                    All Dishes
                  </MenuItem>

                  <MenuItem value="Hot Deals">
                    Hot Deals
                  </MenuItem>

                  <MenuItem value="Featured">
                    Featured
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* =====================================================
          MENU HEADER
      ===================================================== */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
          }}
        >
          All Dishes
        </Typography>

        <Chip
          label={`${filteredItems.length} ${filteredItems.length === 1
            ? 'dish'
            : 'dishes'
            }`}
          size="small"
        />
      </Box>

      {/* =====================================================
          MENU GRID
      ===================================================== */}

      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2,
          md: 3,
        }}
        sx={{
          width: '100%',
          margin: 0,
          mb: {
            xs: 3,
            sm: 4,
            md: commonTokens.spacing.xxxl,
          },
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map(
            (item, index) => {
              const accent =
                getCategoryAccent(
                  item.category
                );

              const discount =
                item.hotDeal &&
                  item.dealPrice
                  ? Math.round(
                    (1 -
                      parsePrice(
                        item.dealPrice
                      ) /
                      parsePrice(
                        item.price
                      )) *
                    100
                  )
                  : null;

              const primaryImage =
                item.images?.[0] || '';

              return (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                  sx={{
                    minWidth: 0,
                  }}
                  key={item.id}
                >
                  <motion.div
                    layout
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: 0.35,
                      delay:
                        index * 0.04,
                    }}
                    style={{
                      height: '100%',
                    }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection:
                          'column',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition:
                          'all 0.3s ease',
                        '&:hover': {
                          transform:
                            'translateY(-5px)',
                          boxShadow:
                            '0 16px 35px rgba(0,0,0,0.12)',
                          '& .product-image':
                          {
                            transform:
                              'scale(1.08)',
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position:
                            'relative',
                          height: {
                            xs: 180,
                            sm: 190,
                            md: 200,
                          },
                          overflow:
                            'hidden',
                        }}
                      >
                        <Box
                          className="product-image"
                          component="img"
                          src={
                            primaryImage
                          }
                          alt={item.name}
                          sx={{
                            width:
                              '100%',
                            height:
                              '100%',
                            objectFit:
                              'cover',
                            transition:
                              'transform 0.35s ease',
                          }}
                        />

                        <Box
                          sx={{
                            position:
                              'absolute',
                            inset: 0,
                            background:
                              'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
                          }}
                        />

                        {item.hotDeal && (
                          <Chip
                            icon={
                              <LocalFireDepartmentIcon
                                sx={{
                                  fontSize: 16,
                                }}
                              />
                            }
                            label={
                              discount
                                ? `${discount}% OFF`
                                : 'Hot Deal'
                            }
                            size="small"
                            sx={{
                              position:
                                'absolute',
                              top: 12,
                              left: 12,
                              fontWeight: 800,
                              color:
                                '#fff',
                              backgroundColor:
                                theme
                                  .palette
                                  .error
                                  .main,
                              '& .MuiChip-icon':
                              {
                                color:
                                  '#fff',
                              },
                            }}
                          />
                        )}

                        <Tooltip
                          title={
                            item.featured
                              ? 'Featured dish'
                              : 'Not featured'
                          }
                        >
                          <IconButton
                            size="small"
                            sx={{
                              position:
                                'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor:
                                alpha(
                                  '#000',
                                  0.35
                                ),
                              color:
                                item.featured
                                  ? theme
                                    .palette
                                    .warning
                                    .light
                                  : '#fff',
                              '&:hover':
                              {
                                backgroundColor:
                                  alpha(
                                    '#000',
                                    0.5
                                  ),
                              },
                            }}
                          >
                            {item.featured ? (
                              <StarRoundedIcon fontSize="small" />
                            ) : (
                              <StarOutlineRoundedIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Chip
                          label={
                            item.category
                          }
                          size="small"
                          sx={{
                            position:
                              'absolute',
                            bottom: 10,
                            left: 12,
                            fontWeight: 700,
                            color:
                              '#fff',
                            backgroundColor:
                              alpha(
                                accent,
                                0.85
                              ),
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          flex: 1,
                          display:
                            'flex',
                          flexDirection:
                            'column',
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            fontSize:
                              '1.05rem',
                            overflow:
                              'hidden',
                            textOverflow:
                              'ellipsis',
                            whiteSpace:
                              'nowrap',
                          }}
                        >
                          {item.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                            lineHeight:
                              1.5,
                            display:
                              '-webkit-box',
                            WebkitLineClamp:
                              2,
                            WebkitBoxOrient:
                              'vertical',
                            overflow:
                              'hidden',
                            minHeight: 42,
                          }}
                        >
                          {
                            item.shortDescription
                          }
                        </Typography>

                        {item.allergens
                          .length >
                          0 && (
                            <Stack
                              direction="row"
                              spacing={
                                0.75
                              }
                              sx={{
                                mt: 1.5,
                                flexWrap:
                                  'wrap',
                                gap: 0.75,
                              }}
                            >
                              {item.allergens
                                .slice(
                                  0,
                                  3
                                )
                                .map(
                                  (
                                    allergen
                                  ) => (
                                    <Chip
                                      key={
                                        allergen
                                      }
                                      icon={
                                        <EggAlertOutlinedIcon
                                          sx={{
                                            fontSize: 14,
                                          }}
                                        />
                                      }
                                      label={
                                        allergen
                                      }
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        fontSize:
                                          '0.7rem',
                                        height: 22,
                                      }}
                                    />
                                  )
                                )}
                            </Stack>
                          )}

                        <Divider
                          sx={{
                            my: 2,
                          }}
                        />

                        <Box
                          sx={{
                            display:
                              'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'space-between',
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Price
                            </Typography>

                            <Box
                              sx={{
                                display:
                                  'flex',
                                alignItems:
                                  'baseline',
                                gap: 1,
                              }}
                            >
                              {item.hotDeal &&
                                item.dealPrice ? (
                                <>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 800,
                                      color:
                                        theme
                                          .palette
                                          .error
                                          .main,
                                    }}
                                  >
                                    {
                                      item.dealPrice
                                    }
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    sx={{
                                      textDecoration:
                                        'line-through',
                                      color:
                                        'text.disabled',
                                    }}
                                  >
                                    {
                                      item.price
                                    }
                                  </Typography>
                                </>
                              ) : (
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 800,
                                  }}
                                >
                                  {
                                    item.price
                                  }
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          {item.tags
                            ?.length >
                            0 && (
                              <Chip
                                label={
                                  item
                                    .tags[0]
                                }
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{
                                  fontWeight: 700,
                                }}
                              />
                            )}
                        </Box>

                        <Box
                          sx={{
                            display:
                              'flex',
                            gap: 1,
                            mt: 'auto',
                          }}
                        >
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={
                              <VisibilityOutlinedIcon />
                            }
                            onClick={() =>
                              openDetail(
                                item
                              )
                            }
                            sx={{
                              minHeight: 38,
                              borderRadius: 2,
                              textTransform:
                                'none',
                              fontWeight: 600,
                            }}
                          >
                            View
                          </Button>

                          <IconButton
                            onClick={() =>
                              openEditForm(
                                item
                              )
                            }
                            sx={{
                              width: 38,
                              height: 38,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            onClick={() => handleDeleteItem(item.id)}
                            sx={{
                              width: 38,
                              height: 38,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              color:
                                theme
                                  .palette
                                  .error
                                  .main,
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            }
          )}
        </AnimatePresence>
      </Grid>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filteredItems.length === 0 && (
        <Card
          elevation={0}
          sx={{
            mt: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            p: {
              xs: 4,
              sm: 6,
            },
            textAlign: 'center',
          }}
        >
          <SoupKitchenOutlinedIcon
            sx={{
              fontSize: 56,
              color: 'text.disabled',
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            No dishes found
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Try adjusting your search
            or filters.
          </Typography>

          <Button
            variant="outlined"
            sx={{
              mt: 3,
              borderRadius: 2,
              textTransform: 'none',
            }}
            onClick={() => {
              setSearchQuery('');
              setCategory('All');
              setDealFilter('All');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* =====================================================
          DETAIL DIALOG
      ===================================================== */}

      <Dialog
        open={Boolean(viewItem)}
        onClose={closeDetail}
        fullWidth
        maxWidth="sm"
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
            },
          },
          paper: {
            sx: {
              borderRadius: {
                xs: 0,
                sm: 4,
              },
              backgroundImage: 'none',
              width: '100%',
              margin: {
                xs: 0,
                sm: 2,
              },
              maxHeight: {
                xs: '100%',
                sm: '92vh',
              },
              overflow: 'hidden',
            },
          },
        }}
      >
        {viewItem && (
          <>
            <Box
              sx={{
                position: 'relative',
                height: 260,
              }}
            >
              <Box
                component="img"
                src={
                  viewItem.images?.[
                  viewImageIndex
                  ] ||
                  viewItem.images?.[0]
                }
                alt={viewItem.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              <Box
                sx={{
                  position:
                    'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)',
                }}
              />

              <IconButton
                onClick={closeDetail}
                sx={{
                  position:
                    'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor:
                    alpha(
                      '#000',
                      0.4
                    ),
                  color: '#fff',
                  '&:hover': {
                    backgroundColor:
                      alpha(
                        '#000',
                        0.55
                      ),
                  },
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box
                sx={{
                  position:
                    'absolute',
                  left: 20,
                  bottom: 16,
                  right: 20,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mb: 1,
                    flexWrap:
                      'wrap',
                    gap: 0.5,
                  }}
                >
                  <Chip
                    label={
                      viewItem.category
                    }
                    size="small"
                    sx={{
                      fontWeight: 700,
                      color: '#fff',
                      backgroundColor:
                        alpha(
                          getCategoryAccent(
                            viewItem.category
                          ),
                          0.85
                        ),
                    }}
                  />

                  {viewItem.tags?.map(
                    (tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          color: '#fff',
                          backgroundColor:
                            alpha(
                              '#000',
                              0.4
                            ),
                        }}
                      />
                    )
                  )}
                </Stack>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: '#fff',
                  }}
                >
                  {viewItem.name}
                </Typography>
              </Box>

              {viewItem.images?.length >
                1 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      position:
                        'absolute',
                      bottom: -1,
                      left: 0,
                      right: 0,
                      px: 2,
                      pb: 1,
                      justifyContent:
                        'flex-end',
                    }}
                  >
                    {viewItem.images.map(
                      (
                        src,
                        idx
                      ) => (
                        <Box
                          key={
                            src +
                            idx
                          }
                          onClick={() =>
                            setViewImageIndex(
                              idx
                            )
                          }
                          component="img"
                          src={src}
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: 1.5,
                            objectFit:
                              'cover',
                            cursor:
                              'pointer',
                            border: `2px solid ${idx ===
                              viewImageIndex
                              ? '#fff'
                              : 'transparent'
                              }`,
                            opacity:
                              idx ===
                                viewImageIndex
                                ? 1
                                : 0.7,
                          }}
                        />
                      )
                    )}
                  </Stack>
                )}
            </Box>

            <DialogContent
              sx={{
                px: {
                  xs: 2.5,
                  sm: 3,
                },
                py: 3,
              }}
            >
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'space-between',
                  }}
                >
                  {viewItem.hotDeal &&
                    viewItem.dealPrice ? (
                    <Box
                      sx={{
                        display:
                          'flex',
                        alignItems:
                          'baseline',
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color:
                            theme
                              .palette
                              .error
                              .main,
                        }}
                      >
                        {
                          viewItem.dealPrice
                        }
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{
                          textDecoration:
                            'line-through',
                          color:
                            'text.disabled',
                        }}
                      >
                        {viewItem.price}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                      }}
                    >
                      {viewItem.price}
                    </Typography>
                  )}

                  {viewItem.featured && (
                    <Chip
                      icon={
                        <StarRoundedIcon />
                      }
                      label="Featured"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        color:
                          theme
                            .palette
                            .warning
                            .main,
                        backgroundColor:
                          alpha(
                            theme
                              .palette
                              .warning
                              .main,
                            0.12
                          ),
                      }}
                    />
                  )}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.7,
                  }}
                >
                  {viewItem.description}
                </Typography>

                {/* =================================================
                    DEAL CONTENT
                ================================================= */}

                {viewItem.hotDeal &&
                  viewItem.dealItems?.length >
                  0 && (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        Included in this deal
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          flexWrap:
                            'wrap',
                          gap: 1,
                        }}
                      >
                        {viewItem.dealItems.map(
                          (dealItemId) => {
                            const dealItem =
                              items.find(
                                (item) =>
                                  item.id ===
                                  dealItemId
                              );

                            if (!dealItem)
                              return null;

                            return (
                              <Chip
                                key={
                                  dealItemId
                                }
                                label={
                                  dealItem.name
                                }
                                size="small"
                                variant="outlined"
                              />
                            );
                          }
                        )}
                      </Stack>
                    </Box>
                  )}

                {viewItem.chefRecommendation && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: `1px dashed ${alpha(
                        theme.palette
                          .primary
                          .main,
                        0.35
                      )}`,
                      backgroundColor:
                        alpha(
                          theme.palette
                            .primary
                            .main,
                          0.05
                        ),
                      display:
                        'flex',
                      gap: 1.5,
                    }}
                  >
                    <FormatQuoteRoundedIcon color="primary" />

                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle:
                          'italic',
                      }}
                    >
                      {
                        viewItem.chefRecommendation
                      }
                    </Typography>
                  </Box>
                )}

                {viewItem.ingredients
                  ?.length >
                  0 && (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        Ingredients
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          flexWrap:
                            'wrap',
                          gap: 1,
                        }}
                      >
                        {viewItem.ingredients.map(
                          (
                            ingredient
                          ) => (
                            <Chip
                              key={
                                ingredient
                              }
                              label={
                                ingredient
                              }
                              size="small"
                              variant="outlined"
                            />
                          )
                        )}
                      </Stack>
                    </Box>
                  )}

                {viewItem.allergens
                  ?.length >
                  0 && (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        Allergens
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          flexWrap:
                            'wrap',
                          gap: 1,
                        }}
                      >
                        {viewItem.allergens.map(
                          (
                            allergen
                          ) => (
                            <Chip
                              key={
                                allergen
                              }
                              icon={
                                <EggAlertOutlinedIcon
                                  sx={{
                                    fontSize: 16,
                                  }}
                                />
                              }
                              label={
                                allergen
                              }
                              size="small"
                              sx={{
                                color:
                                  theme
                                    .palette
                                    .warning
                                    .main,
                                backgroundColor:
                                  alpha(
                                    theme
                                      .palette
                                      .warning
                                      .main,
                                    0.1
                                  ),
                                '& .MuiChip-icon':
                                {
                                  color:
                                    theme
                                      .palette
                                      .warning
                                      .main,
                                },
                              }}
                            />
                          )
                        )}
                      </Stack>
                    </Box>
                  )}
              </Stack>
            </DialogContent>

            <DialogActions
              sx={{
                px: {
                  xs: 2.5,
                  sm: 3,
                },
                py: 2,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <EditOutlinedIcon />
                }
                onClick={() => {
                  closeDetail();
                  openEditForm(
                    viewItem
                  );
                }}
                sx={{
                  textTransform:
                    'none',
                  borderRadius: 2,
                  minHeight: 42,
                  fontWeight: 700,
                }}
              >
                Edit Dish
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* =====================================================
          ADD / EDIT DIALOG
      ===================================================== */}

      <Dialog
        open={openForm}
        onClose={closeForm}
        fullWidth
        maxWidth="md"
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
            },
          },
          paper: {
            sx: {
              borderRadius: {
                xs: 0,
                sm: 4,
              },
              backgroundImage: 'none',
              width: '100%',
              margin: {
                xs: 0,
                sm: 2,
              },
              maxHeight: {
                xs: '100%',
                sm: '90vh',
              },
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            px: {
              xs: 2.5,
              sm: 3,
            },
            pt: 3,
            pb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems:
                'center',
              justifyContent:
                'space-between',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                }}
              >
                {editingId !== null
                  ? 'Edit Dish'
                  : 'Add New Dish'}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                {editingId !== null
                  ? 'Update the details of this menu item.'
                  : 'Add a new dish to the Pastizza menu.'}
              </Typography>
            </Box>

            <IconButton
              onClick={closeForm}
              sx={{
                borderRadius: 2,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: {
              xs: 2.5,
              sm: 3,
            },
          }}
        >
          <Stack spacing={2.5}>
            {/* =================================================
                DISH NAME
            ================================================= */}

            <TextField
              fullWidth
              label="Dish Name"
              name="name"
              value={
                formData.name
              }
              onChange={
                handleFormChange
              }
              error={Boolean(
                formErrors.name
              )}
              helperText={
                formErrors.name
              }
              placeholder="e.g. Truffle Risotto"
            />

            {/* =================================================
                CATEGORY + PRICE
            ================================================= */}

            <Grid
              container
              spacing={2}
            >
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <FormControl
                  fullWidth
                  error={Boolean(
                    formErrors.category
                  )}
                >
                  <InputLabel>
                    Category
                  </InputLabel>

                  <Select
                    name="category"
                    label="Category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleFormChange
                    }
                  >
                    {categories.map(
                      (option) => (
                        <MenuItem
                          key={option.id}
                          value={
                            option.name
                          }
                        >
                          {option.name}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  error={Boolean(formErrors.price)}
                  helperText={formErrors.price}
                  placeholder="34"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          Rs.
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          /-
                        </InputAdornment>
                      )
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* =================================================
                SHORT DESCRIPTION
            ================================================= */}

            <TextField
              fullWidth
              label="Short Description"
              name="shortDescription"
              value={
                formData.shortDescription
              }
              onChange={
                handleFormChange
              }
              error={Boolean(
                formErrors.shortDescription
              )}
              helperText={
                formErrors.shortDescription
              }
              placeholder="One line shown on the menu card"
            />

            {/* =================================================
                FULL DESCRIPTION
            ================================================= */}

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Full Description"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleFormChange
              }
              placeholder="Describe the dish in detail..."
            />

            {/* =================================================
                MULTIPLE IMAGE PICKER
            ================================================= */}

            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Dish Images
              </Typography>

              <Box
                onDragEnter={
                  handleImageDragEnter
                }
                onDragOver={
                  handleImageDragOver
                }
                onDragLeave={
                  handleImageDragLeave
                }
                onDrop={
                  handleImageDrop
                }
                sx={{
                  border: `2px dashed ${isDraggingImages
                    ? theme
                      .palette
                      .primary
                      .main
                    : formErrors.images
                      ? theme
                        .palette
                        .error
                        .main
                      : theme
                        .palette
                        .divider
                    }`,
                  borderRadius: 3,
                  minHeight: 150,
                  p: 3,
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor:
                    isDraggingImages
                      ? alpha(
                        theme
                          .palette
                          .primary
                          .main,
                        0.06
                      )
                      : 'transparent',
                  transition:
                    'all 0.2s ease',
                  '&:hover': {
                    borderColor:
                      theme
                        .palette
                        .primary
                        .main,
                    backgroundColor:
                      alpha(
                        theme
                          .palette
                          .primary
                          .main,
                        0.04
                      ),
                  },
                }}
                onClick={() =>
                  document
                    .getElementById(
                      'dish-images-input'
                    )
                    ?.click()
                }
              >
                <input
                  id="dish-images-input"
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={
                    handleImageInputChange
                  }
                />

                <Box>
                  <CloudUploadOutlinedIcon
                    sx={{
                      fontSize: 44,
                      color:
                        isDraggingImages
                          ? 'primary.main'
                          : 'text.secondary',
                      mb: 1,
                    }}
                  />

                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {isDraggingImages
                      ? 'Drop your images here'
                      : 'Drag & drop images here'}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    or click to browse
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display:
                        'block',
                      mt: 1,
                    }}
                  >
                    You can select multiple
                    images
                  </Typography>
                </Box>
              </Box>

              {formErrors.images && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{
                    display:
                      'block',
                    mt: 0.75,
                    ml: 1.5,
                  }}
                >
                  {
                    formErrors.images
                  }
                </Typography>
              )}

              {formData.images
                .length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display:
                          'block',
                        mb: 1,
                      }}
                    >
                      Selected images (
                      {
                        formData
                          .images
                          .length
                      }
                      )
                    </Typography>

                    <Grid
                      container
                      spacing={1.5}
                    >
                      {formData.images.map(
                        (
                          image,
                          index
                        ) => (
                          <Grid
                            key={
                              image.id ||
                              `${image.src}-${index}`
                            }
                            size={{
                              xs: 6,
                              sm: 4,
                              md: 3,
                            }}
                          >
                            <Box
                              sx={{
                                position:
                                  'relative',
                                height: 130,
                                borderRadius: 2,
                                overflow:
                                  'hidden',
                                border: `1px solid ${theme.palette.divider}`,
                                '&:hover .image-delete':
                                {
                                  opacity: 1,
                                },
                              }}
                            >
                              <Box
                                component="img"
                                src={
                                  getImageSrc(
                                    image
                                  )
                                }
                                alt={
                                  image.name ||
                                  `Dish image ${index +
                                  1
                                  }`
                                }
                                sx={{
                                  width:
                                    '100%',
                                  height:
                                    '100%',
                                  objectFit:
                                    'cover',
                                  display:
                                    'block',
                                }}
                              />

                              {index ===
                                0 && (
                                  <Chip
                                    label="Primary"
                                    size="small"
                                    color="primary"
                                    sx={{
                                      position:
                                        'absolute',
                                      top: 8,
                                      left: 8,
                                      fontWeight: 700,
                                    }}
                                  />
                                )}

                              <Box
                                sx={{
                                  position:
                                    'absolute',
                                  bottom: 8,
                                  left: 8,
                                  width: 26,
                                  height: 26,
                                  borderRadius:
                                    '50%',
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  justifyContent:
                                    'center',
                                  backgroundColor:
                                    alpha(
                                      '#000',
                                      0.65
                                    ),
                                  color:
                                    '#fff',
                                  fontSize: 12,
                                  fontWeight: 700,
                                }}
                              >
                                {index +
                                  1}
                              </Box>

                              <IconButton
                                className="image-delete"
                                size="small"
                                onClick={(
                                  event
                                ) => {
                                  event.stopPropagation();

                                  removeImage(
                                    image.id
                                  );
                                }}
                                sx={{
                                  position:
                                    'absolute',
                                  top: 6,
                                  right: 6,
                                  width: 30,
                                  height: 30,
                                  color:
                                    '#fff',
                                  backgroundColor:
                                    alpha(
                                      '#000',
                                      0.6
                                    ),
                                  opacity:
                                  {
                                    xs: 1,
                                    sm: 0,
                                  },
                                  transition:
                                    'opacity 0.2s ease',
                                  '&:hover':
                                  {
                                    backgroundColor:
                                      theme
                                        .palette
                                        .error
                                        .main,
                                  },
                                }}
                              >
                                <DeleteOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            {index >
                              0 && (
                                <Button
                                  fullWidth
                                  size="small"
                                  onClick={() =>
                                    moveImage(
                                      index,
                                      0
                                    )
                                  }
                                  sx={{
                                    mt: 0.5,
                                    minHeight:
                                      28,
                                    textTransform:
                                      'none',
                                    fontSize:
                                      '0.7rem',
                                  }}
                                >
                                  Make Primary
                                </Button>
                              )}
                          </Grid>
                        )
                      )}
                    </Grid>
                  </Box>
                )}
            </Box>

            {/* =================================================
                CHEF NOTE
            ================================================= */}

            <TextField
              fullWidth
              label="Chef's Note (optional)"
              name="chefRecommendation"
              value={
                formData.chefRecommendation
              }
              onChange={
                handleFormChange
              }
              placeholder="A tip or pairing suggestion"
            />

            {/* =================================================
                INGREDIENTS
            ================================================= */}

            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Ingredients
              </Typography>

              <Stack
                direction="row"
                sx={{
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                {ingredients.map(
                  (ingredient) => {
                    const active =
                      formData.ingredients.includes(
                        ingredient.name
                      );

                    return (
                      <Chip
                        key={ingredient.id}
                        label={ingredient.name}
                        onClick={() =>
                          toggleIngredient(
                            ingredient.name
                          )
                        }
                        color={
                          active
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          active
                            ? 'filled'
                            : 'outlined'
                        }
                        sx={{
                          fontWeight: 600,
                          cursor:
                            'pointer',
                        }}
                      />
                    );
                  }
                )}
              </Stack>

              {formData.ingredients
                .length > 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display:
                        'block',
                      mt: 1,
                    }}
                  >
                    Selected:{' '}
                    {formData.ingredients.join(
                      ', '
                    )}
                  </Typography>
                )}

              {formErrors.ingredients && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{
                    display:
                      'block',
                    mt: 0.75,
                    ml: 1.5,
                  }}
                >
                  {
                    formErrors.ingredients
                  }
                </Typography>
              )}
            </Box>

            {/* =================================================
                ALLERGENS
            ================================================= */}

            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Allergens
              </Typography>

              <Stack
                direction="row"
                sx={{
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                {allergens.map(
                  (allergen) => {
                    const active =
                      formData.allergens.includes(
                        allergen.name
                      );

                    return (
                      <Chip
                        key={allergen.id}
                        label={allergen.name}
                        onClick={() =>
                          toggleAllergen(
                            allergen.name
                          )
                        }
                        color={
                          active
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          active
                            ? 'filled'
                            : 'outlined'
                        }
                        sx={{
                          fontWeight: 600,
                          cursor:
                            'pointer',
                        }}
                      />
                    );
                  }
                )}
              </Stack>

              {formData.allergens
                .length > 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display:
                        'block',
                      mt: 1,
                    }}
                  >
                    Selected:{' '}
                    {formData.allergens.join(
                      ', '
                    )}
                  </Typography>
                )}

              {formErrors.allergens && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{
                    display:
                      'block',
                    mt: 0.75,
                    ml: 1.5,
                  }}
                >
                  {
                    formErrors.allergens
                  }
                </Typography>
              )}
            </Box>

            {/* =================================================
                TAGS
            ================================================= */}

            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Tags
              </Typography>

              <Stack
                direction="row"
                sx={{
                  flexWrap:
                    'wrap',
                  gap: 1,
                }}
              >
                {tags.map(
                  (tag) => {
                    const active =
                      formData.tags.includes(
                        tag.name
                      );

                    return (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        onClick={() =>
                          toggleTag(
                            tag.name
                          )
                        }
                        color={
                          active
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          active
                            ? 'filled'
                            : 'outlined'
                        }
                        sx={{
                          fontWeight: 600,
                          cursor:
                            'pointer',
                        }}
                      />
                    );
                  }
                )}
              </Stack>

              {formData.tags
                .length > 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display:
                        'block',
                      mt: 1,
                    }}
                  >
                    Selected:{' '}
                    {formData.tags.join(
                      ', '
                    )}
                  </Typography>
                )}

              {formErrors.tags && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{
                    display:
                      'block',
                    mt: 0.75,
                    ml: 1.5,
                  }}
                >
                  {
                    formErrors.tags
                  }
                </Typography>
              )}
            </Box>

            <Divider />

            {/* =================================================
                DEAL / FEATURED
            ================================================= */}

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={
                      formData.hotDeal
                    }
                    onChange={
                      handleFormChange
                    }
                    name="hotDeal"
                  />
                }
                label="Hot Deal"
              />

              {formData.hotDeal && (
                <>
                  <TextField
                    fullWidth
                    label="Deal Price"
                    name="dealPrice"
                    value={formData.dealPrice}
                    onChange={handleFormChange}
                    error={Boolean(formErrors.dealPrice)}
                    helperText={
                      formErrors.dealPrice ||
                      'Discounted price shown to customers'
                    }
                    placeholder="28"
                    sx={{
                      mt: 1.5,
                      maxWidth: 220,
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            Rs.
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            /-
                          </InputAdornment>
                        )
                      },
                    }}
                  />

                  {/* =================================================
                      NEW: DEAL ITEMS
                      
                      Existing dishes from `items` are displayed
                      as selectable chips.
                  ================================================= */}
                  {
                    items.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            mb: 0.75,
                          }}
                        >
                          Deal Items
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            mb: 1.25,
                          }}
                        >
                          Select one or more existing dishes
                          to include in this deal.
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            flexWrap: 'wrap',
                            gap: 1,
                          }}
                        >
                          {items
                            .filter(
                              (item) =>
                                item.id !==
                                editingId
                            )
                            .map(
                              (dealItem) => {
                                const active =
                                  formData.dealItems.includes(
                                    dealItem.id
                                  );

                                return (
                                  <Chip
                                    key={
                                      dealItem.id
                                    }
                                    label={
                                      dealItem.name
                                    }
                                    onClick={() =>
                                      toggleDealItem(
                                        dealItem.id
                                      )
                                    }
                                    color={
                                      active
                                        ? 'primary'
                                        : 'default'
                                    }
                                    variant={
                                      active
                                        ? 'filled'
                                        : 'outlined'
                                    }
                                    sx={{
                                      fontWeight: 600,
                                      cursor:
                                        'pointer',
                                    }}
                                  />
                                );
                              }
                            )}
                        </Stack>

                        {formErrors.dealItems && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{
                              display:
                                'block',
                              mt: 0.75,
                            }}
                          >
                            {
                              formErrors.dealItems
                            }
                          </Typography>
                        )}

                        {formData.dealItems
                          .length > 0 && (
                            <Box
                              sx={{
                                mt: 1.25,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Selected:{' '}
                                {formData.dealItems
                                  .map(
                                    (
                                      dealItemId
                                    ) =>
                                      items.find(
                                        (
                                          item
                                        ) =>
                                          item.id ===
                                          dealItemId
                                      )?.name
                                  )
                                  .filter(Boolean)
                                  .join(
                                    ', '
                                  )}
                              </Typography>
                            </Box>
                          )}
                      </Box>
                    )
                  }
                </>
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={
                      formData.featured
                    }
                    onChange={
                      handleFormChange
                    }
                    name="featured"
                  />
                }
                label="Featured on menu"
                sx={{
                  mt: 1,
                }}
              />
            </FormGroup>
          </Stack>
        </DialogContent>

        {/* =====================================================
            MODAL ACTIONS
        ===================================================== */}

        <DialogActions
          sx={{
            px: {
              xs: 2.5,
              sm: 3,
            },
            py: 2,
            gap: 1,
            flexDirection: {
              xs: 'column-reverse',
              sm: 'row',
            },
          }}
        >
          <Button
            fullWidth
            onClick={closeForm}
            sx={{
              textTransform:
                'none',
              borderRadius: 2,
              minHeight: 42,
              width: {
                xs: '100%',
                sm: 'auto',
              },
            }}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={
              editingId !== null ? (
                <EditOutlinedIcon />
              ) : (
                <AddIcon />
              )
            }
            onClick={
              handleSaveItem
            }
            sx={{
              textTransform:
                'none',
              borderRadius: 2,
              minHeight: 42,
              fontWeight: 700,
              width: {
                xs: '100%',
                sm: 'auto',
              },
            }}
          >
            {editingId !== null
              ? 'Update Dish'
              : 'Add Dish'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          REMOVE DIALOG
      ===================================================== */}

      <Dialog
        open={Boolean(deleteItemId)}
        onClose={cancelDeleteItem}
        fullWidth
        maxWidth="sm"
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(6px)',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
            },
          },
          paper: {
            sx: {
              borderRadius: {
                xs: 0,
                sm: 4,
              },
              backgroundImage: 'none',
              width: '100%',
              margin: {
                xs: 0,
                sm: 2,
              },
              overflow: 'hidden',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.25)',
            },
          },
        }}
      >
        {/* Decorative Header */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            pt: 4,
            pb: 2,
            overflow: 'hidden',
          }}
        >
          {/* Decorative background circles */}
          <Box
            sx={{
              position: 'absolute',
              width: 150,
              height: 150,
              borderRadius: '50%',
              backgroundColor: (theme) =>
                alpha(theme.palette.error.main, 0.08),
              top: -75,
              left: -50,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: (theme) =>
                alpha(theme.palette.error.main, 0.06),
              top: -55,
              right: -40,
            }}
          />

          {/* Icon */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              width: 68,
              height: 68,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (theme) =>
                alpha(theme.palette.error.main, 0.1),
              color: 'error.main',
              border: (theme) =>
                `1px solid ${alpha(
                  theme.palette.error.main,
                  0.16
                )}`,
            }}
          >
            <DeleteOutlineRoundedIcon
              sx={{
                fontSize: 34,
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <DialogContent
          sx={{
            px: {
              xs: 3,
              sm: 4,
            },
            pt: 1,
            pb: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            {items?.find(x => x.id == deleteItemId)?.name}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            Delete this dish?
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: 340,
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            This dish will be permanently removed from your menu.
            Any deals containing this dish will also be updated.
          </Typography>

          {/* Warning box */}
          <Box
            sx={{
              mt: 3,
              p: 1.75,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
              textAlign: 'left',
              backgroundColor: (theme) =>
                alpha(theme.palette.warning.main, 0.08),
              border: (theme) =>
                `1px solid ${alpha(
                  theme.palette.warning.main,
                  0.16
                )}`,
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (theme) =>
                  alpha(theme.palette.warning.main, 0.12),
                color: 'warning.main',
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                !
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  mb: 0.25,
                }}
              >
                This action cannot be undone
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  lineHeight: 1.5,
                }}
              >
                Make sure you no longer need this dish before
                continuing.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            px: {
              xs: 3,
              sm: 4,
            },
            pb: {
              xs: 3,
              sm: 3.5,
            },
            pt: 1,
            display: 'flex',
            gap: 1.25,
          }}
        >
          <Button
            fullWidth
            onClick={cancelDeleteItem}
            variant="outlined"
            sx={{
              minHeight: 48,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              borderWidth: 1.5,
              '&:hover': {
                borderWidth: 1.5,
              },
            }}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            onClick={confirmDeleteItem}
            variant="contained"
            color="error"
            startIcon={
              <DeleteOutlineRoundedIcon fontSize="small" />
            }
            sx={{
              minHeight: 48,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            }}
          >
            Delete Dish
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          LOADER
      ===================================================== */}

      <Dialog
        open={loading}
        onClose={() => {
          // Intentionally prevent the loading dialog from closing
        }}
        maxWidth={false}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0, 0, 0, 0.35)",
            },
          },
          paper: {
            sx: {
              m: 0,
              width: 90,
              height: 90,
              borderRadius: 3,
              backgroundImage: "none",
              backgroundColor: "background.paper",
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            "&::before": {
              content: '""',
              position: "absolute",
              inset: -5,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)",
              animation: "pulse 1.5s ease-in-out infinite",
            },

            "@keyframes pulse": {
              "0%, 100%": {
                transform: "scale(0.85)",
                opacity: 0.5,
              },
              "50%": {
                transform: "scale(1.15)",
                opacity: 1,
              },
            },
          }}
        >
          <CircularProgress
            size={32}
            thickness={4}
            sx={{
              position: "relative",
              zIndex: 1,
            }}
          />
        </Box>
      </Dialog>

      {/* =====================================================
          TOAST
      ===================================================== */}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() =>
          setToast((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{
          bottom: {
            xs: 16,
            sm: 24,
          },
          right: {
            xs: 16,
            sm: 24,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,

            width: {
              xs: 'calc(100vw - 32px)',
              sm: 390,
            },

            minHeight: 72,
            px: 2,
            py: 1.5,

            overflow: 'hidden',

            borderRadius: 3,

            backgroundColor:
              toast.severity === 'success'
                ? 'rgba(255, 255, 255, 0.98)'
                : 'rgba(255, 255, 255, 0.98)',

            border: '1px solid',
            borderColor:
              toast.severity === 'success'
                ? 'rgba(46, 125, 91, 0.16)'
                : 'rgba(211, 47, 47, 0.16)',

            boxShadow:
              '0 18px 50px rgba(0, 0, 0, 0.16), 0 4px 14px rgba(0, 0, 0, 0.08)',

            backdropFilter: 'blur(18px)',

            animation: 'toastEnter 0.4s cubic-bezier(0.22, 1, 0.36, 1)',

            '@keyframes toastEnter': {
              from: {
                opacity: 0,
                transform: 'translateY(20px) translateX(15px) scale(0.96)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0) translateX(0) scale(1)',
              },
            },

            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor:
                toast.severity === 'success'
                  ? 'success.main'
                  : 'error.main',
            },
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              flexShrink: 0,

              width: 42,
              height: 42,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              borderRadius: '50%',

              backgroundColor:
                toast.severity === 'success'
                  ? 'rgba(46, 125, 91, 0.10)'
                  : 'rgba(211, 47, 47, 0.10)',

              color:
                toast.severity === 'success'
                  ? 'success.main'
                  : 'error.main',

              '& svg': {
                fontSize: 23,
              },
            }}
          >
            {toast.severity === 'success' ? (
              <CheckCircleOutlineIcon />
            ) : (
              <ErrorOutlineIcon />
            )}
          </Box>

          {/* Message */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.35,
              }}
            >
              {toast.severity === 'success'
                ? 'Success'
                : 'Something went wrong'}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: '0.82rem',
                color: 'text.secondary',
                lineHeight: 1.4,
              }}
            >
              {toast.message}
            </Typography>
          </Box>

          {/* Close */}
          <IconButton
            size="small"
            onClick={() =>
              setToast((previous) => ({
                ...previous,
                open: false,
              }))
            }
            sx={{
              flexShrink: 0,
              width: 30,
              height: 30,

              color: 'text.secondary',

              '&:hover': {
                backgroundColor: 'action.hover',
                color: 'text.primary',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default Products;