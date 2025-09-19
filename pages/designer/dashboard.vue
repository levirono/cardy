<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Designer Dashboard</h1>
        <p class="text-text/60 mt-1">Manage design requests and your workload</p>
      </div>
      <UButton
        color="primary"
        @click="isAvailable = !isAvailable"
        :icon="isAvailable ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
        :variant="isAvailable ? 'solid' : 'outline'"
      >
        {{ isAvailable ? 'Available for New Work' : 'Not Available' }}
      </UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Stats Cards -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Requests</p>
            <p class="text-3xl font-bold">{{ stats.active }}</p>
          </div>
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="i-heroicons-inbox" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
            <p class="text-3xl font-bold">{{ stats.inProgress }}</p>
          </div>
          <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <UIcon name="i-heroicons-clock" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
            <p class="text-3xl font-bold">{{ stats.completed }}</p>
          </div>
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold">Design Requests</h2>
      </div>
      
      <UTabs :items="tabs" v-model="selectedTab" class="px-6 pt-2">
        <template #default="{ item, selected }" />
      </UTabs>
      
      <div class="p-6">
        <div v-if="isLoading" class="flex justify-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
        </div>
        
        <div v-else-if="requests.length === 0" class="text-center py-12">
          <UIcon name="i-heroicons-inbox" class="w-12 h-12 mx-auto text-gray-400" />
          <p class="mt-2 text-gray-500">No {{ selectedTab.toLowerCase() }} requests found</p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="request in filteredRequests" 
            :key="request.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium text-lg">{{ request.title }}</h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Requested by {{ request.requester }} • {{ formatDate(request.createdAt) }}
                  </p>
                  <p class="mt-2 text-sm">{{ truncate(request.description, 120) }}</p>
                </div>
                <UBadge :color="getStatusColor(request.status)" variant="subtle">
                  {{ request.status }}
                </UBadge>
              </div>
              
              <div class="mt-4 flex justify-end space-x-2">
                <UButton 
                  v-if="request.status === 'Pending'" 
                  color="primary" 
                  size="sm"
                  @click="acceptRequest(request.id)"
                >
                  Accept Request
                </UButton>
                <UButton 
                  v-else-if="request.status === 'In Progress'" 
                  color="green" 
                  size="sm"
                  @click="completeRequest(request.id)"
                >
                  Mark as Complete
                </UButton>
                <UButton 
                  variant="ghost" 
                  size="sm"
                  @click="viewRequest(request.id)"
                >
                  View Details
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedTab = ref('Pending');
const isAvailable = ref(true);
const isLoading = ref(true);

const tabs = [
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
];

const stats = ref({
  active: 0,
  inProgress: 0,
  completed: 0
});

const requests = ref([
  // This would be populated from an API in a real application
  {
    id: '1',
    title: 'Modern Business Card Design',
    description: 'Need a clean and professional business card design for my consulting business.',
    status: 'Pending',
    requester: 'John Doe',
    createdAt: '2025-09-18T10:30:00Z',
  },
  {
    id: '2',
    title: 'Logo Redesign',
    description: 'Looking to refresh our company logo with a more modern look.',
    status: 'In Progress',
    requester: 'Acme Corp',
    assignedTo: 'You',
    createdAt: '2025-09-17T14:15:00Z',
  },
  {
    id: '3',
    title: 'Event Flyer',
    description: 'Need a flyer for our upcoming product launch event.',
    status: 'Completed',
    requester: 'Tech Innovations',
    assignedTo: 'You',
    completedAt: '2025-09-15T16:45:00Z',
    createdAt: '2025-09-10T09:20:00Z',
  },
]);

// Computed property to filter requests based on selected tab
const filteredRequests = computed(() => {
  return requests.value.filter(request => request.status === selectedTab.value);
});

// Update stats when requests change
watchEffect(() => {
  stats.value = {
    active: requests.value.filter(r => r.status === 'Pending').length,
    inProgress: requests.value.filter(r => r.status === 'In Progress').length,
    completed: requests.value.filter(r => r.status === 'Completed').length,
  };
  
  // Simulate API loading
  if (isLoading.value) {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  }
});

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Truncate long text
const truncate = (text, length) => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

// Get badge color based on status
const getStatusColor = (status) => {
  const statusColors = {
    'Pending': 'yellow',
    'In Progress': 'blue',
    'Completed': 'green',
    'Rejected': 'red',
  };
  return statusColors[status] || 'gray';
};

// Handle accepting a request
const acceptRequest = (requestId) => {
  const request = requests.value.find(r => r.id === requestId);
  if (request) {
    request.status = 'In Progress';
    request.assignedTo = 'You';
    
    useToast().add({
      title: 'Request Accepted',
      description: `You've accepted the design request: ${request.title}`,
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });
  }
};

// Handle completing a request
const completeRequest = (requestId) => {
  const request = requests.value.find(r => r.id === requestId);
  if (request) {
    request.status = 'Completed';
    request.completedAt = new Date().toISOString();
    
    useToast().add({
      title: 'Request Completed',
      description: `You've marked "${request.title}" as completed.`,
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });
  }
};

// Handle viewing request details
const viewRequest = (requestId) => {
  // In a real app, this would navigate to a detailed view
  const request = requests.value.find(r => r.id === requestId);
  if (request) {
    useToast().add({
      title: 'Viewing Request',
      description: `Viewing details for: ${request.title}`,
      icon: 'i-heroicons-eye',
    });
  }
};
</script>
