<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">My Design Requests</h1>
      <p class="text-text/60 mt-1">Track the status of your design requests</p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <div v-else>
      <div v-if="requests.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
        <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto text-gray-400" />
        <h3 class="mt-4 text-lg font-medium">No design requests yet</h3>
        <p class="mt-1 text-gray-500">Submit your first design request and it will appear here</p>
        <UButton 
          to="/designer-request" 
          color="primary" 
          class="mt-6"
          icon="i-heroicons-plus"
        >
          New Design Request
        </UButton>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="request in sortedRequests" 
          :key="request.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="p-5">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <h3 class="text-lg font-medium">{{ request.title }}</h3>
                  <UBadge 
                    :color="getStatusColor(request.status)" 
                    variant="subtle"
                    class="flex-shrink-0 ml-2"
                  >
                    {{ request.status }}
                  </UBadge>
                </div>
                
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {{ request.description }}
                </p>
                
                <div class="mt-3 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1.5" />
                    <span>Requested {{ formatDate(request.createdAt) }}</span>
                  </div>
                  
                  <div v-if="request.assignedTo" class="flex items-center">
                    <UIcon name="i-heroicons-user" class="w-4 h-4 mr-1.5" />
                    <span>Assigned to {{ request.assignedTo }}</span>
                  </div>
                  
                  <div v-if="request.completedAt" class="flex items-center">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mr-1.5" />
                    <span>Completed {{ formatDate(request.completedAt) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-shrink-0 space-x-2">
                <UButton 
                  color="gray" 
                  variant="ghost" 
                  icon="i-heroicons-eye"
                  @click="viewRequest(request.id)"
                  :title="'View details of ' + request.title"
                />
                
                <UButton 
                  v-if="request.status === 'Completed'"
                  color="primary" 
                  variant="solid"
                  @click="downloadDesign(request.id)"
                >
                  <template #leading>
                    <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
                  </template>
                  Download
                </UButton>
                
                <UButton 
                  v-else-if="request.status === 'In Progress'"
                  color="gray" 
                  variant="ghost"
                  icon="i-heroicons-chat-bubble-left"
                  @click="contactDesigner(request.id)"
                  title="Message designer"
                />
              </div>
            </div>
            
            <!-- Design Preview (visible when completed) -->
            <div v-if="request.status === 'Completed' && request.designPreview" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 class="text-sm font-medium mb-2">Design Preview</h4>
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex justify-center">
                <img 
                  :src="request.designPreview" 
                  :alt="'Preview of ' + request.title"
                  class="max-h-40 max-w-full object-contain"
                />
              </div>
              <div class="mt-2 flex justify-end">
                <UButton 
                  size="xs" 
                  color="gray" 
                  variant="ghost"
                  @click="request.showFullPreview = !request.showFullPreview"
                >
                  {{ request.showFullPreview ? 'Hide' : 'View' }} Full Design
                </UButton>
              </div>
              
              <div v-if="request.showFullPreview" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <img 
                  :src="request.designPreview" 
                  :alt="'Full preview of ' + request.title"
                  class="w-full h-auto rounded"
                />
              </div>
            </div>
            
            <!-- Feedback Section (visible when completed) -->
            <div v-if="request.status === 'Completed'" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 class="text-sm font-medium mb-2">How did we do?</h4>
              <div class="flex items-center space-x-2">
                <UButton 
                  v-for="rating in [1, 2, 3, 4, 5]" 
                  :key="rating"
                  :color="request.userRating && request.userRating >= rating ? 'yellow' : 'gray'"
                  variant="ghost"
                  size="xs"
                  :icon="request.userRating && request.userRating >= rating ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
                  @click="rateDesign(request, rating)"
                  :title="`Rate ${rating} star${rating !== 1 ? 's' : ''}`"
                />
                <span v-if="request.userRating" class="ml-2 text-sm text-gray-500">
                  {{ request.userFeedback || 'Thanks for your feedback!' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-8 flex justify-center">
          <UButton 
            to="/designer-request" 
            color="primary" 
            variant="outline"
            icon="i-heroicons-plus"
          >
            New Design Request
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isLoading = ref(true);

// Mock data - in a real app, this would come from an API
const requests = ref([
  {
    id: '1',
    title: 'Modern Business Card Design',
    description: 'Need a clean and professional business card design for my consulting business.',
    status: 'In Progress',
    assignedTo: 'Alex Johnson',
    createdAt: '2025-09-18T10:30:00Z',
    designPreview: null,
    showFullPreview: false,
    userRating: null,
    userFeedback: ''
  },
  {
    id: '2',
    title: 'Logo Redesign',
    description: 'Looking to refresh our company logo with a more modern look.',
    status: 'Completed',
    assignedTo: 'Sarah Miller',
    createdAt: '2025-09-10T14:15:00Z',
    completedAt: '2025-09-17T16:45:00Z',
    designPreview: 'https://via.placeholder.com/800x600/F3F4F6/111827?text=Logo+Design+Preview',
    showFullPreview: false,
    userRating: 5,
    userFeedback: 'Absolutely love the new design!'
  },
  {
    id: '3',
    title: 'Event Flyer',
    description: 'Need a flyer for our upcoming product launch event.',
    status: 'Completed',
    assignedTo: 'Michael Chen',
    createdAt: '2025-09-05T09:20:00Z',
    completedAt: '2025-09-12T11:30:00Z',
    designPreview: 'https://via.placeholder.com/800x600/F3F4F6/111827?text=Event+Flyer+Preview',
    showFullPreview: false,
    userRating: 4,
    userFeedback: 'Great work, just a few minor tweaks needed.'
  },
]);

// Sort requests by creation date (newest first)
const sortedRequests = computed(() => {
  return [...requests.value].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
});

// Simulate loading data
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
});

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Get status color for badges
const getStatusColor = (status) => {
  const statusColors = {
    'Pending': 'yellow',
    'In Progress': 'blue',
    'Completed': 'green',
    'Rejected': 'red',
  };
  return statusColors[status] || 'gray';
};

// View request details
const viewRequest = (requestId) => {
  const request = requests.value.find(r => r.id === requestId);
  if (request) {
    // In a real app, this would navigate to a detailed view
    useToast().add({
      title: 'Viewing Request',
      description: `Viewing details for: ${request.title}`,
      icon: 'i-heroicons-eye',
    });
  }
};

// Download design
const downloadDesign = (requestId) => {
  const request = requests.value.find(r => r.id === requestId);
  if (request) {
    // In a real app, this would trigger a download
    useToast().add({
      title: 'Downloading Design',
      description: `Preparing download for: ${request.title}`,
      icon: 'i-heroicons-arrow-down-tray',
    });
    
    // Simulate download
    setTimeout(() => {
      useToast().add({
        title: 'Download Complete',
        description: `Your design has been downloaded.`,
        icon: 'i-heroicons-check-circle',
        color: 'green'
      });
    }, 1500);
  }
};

// Contact designer
const contactDesigner = (requestId) => {
  const request = requests.value.find(r => r.id === requestId);
  if (request) {
    // In a real app, this would open a chat/messaging interface
    useToast().add({
      title: 'Contact Designer',
      description: `Messaging ${request.assignedTo} about your request...`,
      icon: 'i-heroicons-chat-bubble-left-ellipsis',
    });
  }
};

// Rate design
const rateDesign = (request, rating) => {
  request.userRating = rating;
  
  // In a real app, this would send the rating to your backend
  useToast().add({
    title: 'Thank You!',
    description: `You rated this design ${rating} star${rating !== 1 ? 's' : ''}.`,
    icon: 'i-heroicons-hand-thumb-up',
    color: 'green'
  });
  
  // If it's less than 5 stars, prompt for feedback
  if (rating < 5) {
    request.userFeedback = prompt('How could we improve? (Optional)') || '';
  } else {
    request.userFeedback = 'Thank you for your 5-star rating!';
  }
};
</script>
