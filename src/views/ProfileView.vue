<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getUserBy } from '../../libs/userManagement'
import { getPlansBy } from '../../libs/planManagement'
import PlanContainer from '@/components/PlanContainer.vue'
import PlanCard from '@/components/PlanCard.vue'
import { User } from '../../classes/User'
import UserProfilePlaceholder from '@/components/UserProfilePlaceholder.vue'
import PlannetLayout from '@/components/PlannetLayout.vue'
import SortMethodSelector from '@/components/SortMethodSelector.vue'
import { sortObject } from '../../libs/utils'

const route = useRoute()
const user = ref(new User())
const postPlans = ref([])
const postCount = ref(0)
const upVoteCount = ref(0)
const sortPostBy = ref(['postDate', 'desc'])
const sortablePostPlans = computed(() => {
  return sortObject(postPlans.value, sortPostBy.value[0], sortPostBy.value[1])
})

async function fetchProfile() {
  user.value = await getUserBy('id', route.params.id)
  postPlans.value = await getPlansBy('authorId', user.value.id, 'post')
  postCount.value = postPlans.value.length
  upVoteCount.value = postPlans.value.reduce((acc, plan) => acc + plan.upVote, 0)
}

onMounted(
  async () => {
    fetchProfile()
  }
)

watch(route, () => {
  fetchProfile()
})

</script>

<template>
  <PlannetLayout>
    <div class="flex flex-col w-[90%] md:w-[80%] gap-4 my-10">
      <div class="overflow-hidden hidden md:flex flex-col bg-base-200 rounded-2xl border border-neutral w-full h-80">
        <img
          v-if="user?.setting?.avatarUrl"
          :src="user.setting.avatarUrl"
          alt="avatar"
          class="absolute rounded-full h-52 w-52 object-cover border-8 border-base-200 translate-x-8 translate-y-24"
        />
        <UserProfilePlaceholder v-else color="#ff5500" bgcolor="white" class="absolute rounded-full h-52 w-52 object-cover border-8 border-base-200 translate-x-8 translate-y-24"/>
        <div class="h-[12rem]">
          <img
            v-if="user?.setting?.bannerUrl"
            :src="user.setting.bannerUrl"
            alt="avatar"
            class="w-full h-full object-cover"
          />
          <div v-else class="bg-neutral w-full h-full object-cover"></div>
        </div>
        <div class="h-[8rem] bg-base-200 flex flex-col gap-4 mt-4 translate-x-[16rem]">
          <div class="flex flex-col">
            <div class="text-2xl font-bold">{{ user.nickname }}</div>
            <div class=" opacity-50">{{ '@' + user.username }}</div>
          </div>
          <div class="flex gap-2">
            <div class="text-sm"><span class="font-bold">{{ postCount }}</span> Posts</div>
            <div class="text-sm"><span class="font-bold text-primary">{{ upVoteCount }}</span> Upvotes</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:hidden bg-base-200 rounded-2xl border border-neutral w-full h-[23rem]">
        <img
          v-if="user?.setting?.avatarUrl"
          :src="user.setting.avatarUrl"
          alt="avatar"
          class="absolute rounded-full h-[10rem] w-[10rem] object-cover border-8 border-base-200 translate-x-4 translate-y-24"
        />
        <UserProfilePlaceholder v-else color="#ff5500" bgcolor="white" class="absolute rounded-full h-[10rem] w-[10rem] object-cover border-8 border-base-200 translate-x-4 translate-y-24"/>
        <div class="h-[10.75rem]">
          <img
            v-if="user?.setting?.bannerUrl"
            :src="user.setting.bannerUrl"
            alt="avatar"
            class="w-full h-full object-cover rounded-t-2xl"
          />
          <div v-else class="bg-neutral w-full h-full object-cover rounded-t-2xl"></div>
        </div>
        <div class="h-[5rem] bg-base-200 w-fit flex flex-col gap-3 absolute top-[19rem] left-12">
          <div class="flex flex-col">
            <div class="text-xl font-bold">{{ user.nickname }}</div>
            <div class=" opacity-50 text-sm">{{ '@' + user.username }}</div>
          </div>
          <div class="flex gap-2">
            <div class="text-sm"><span class="font-bold">{{ postCount }}</span> Posts</div>
            <div class="text-sm"><span class="font-bold text-primary">{{ upVoteCount }}</span> Upvotes</div>
          </div>
        </div>
      </div>
      <nav class="flex items-center gap-4">
        <button class="btn btn-sm border border-neutral">{{ user.nickname }} 's post</button>
        <SortMethodSelector
          :sortOptions="[
            ['Latest', 'postDate', 'desc'],
            ['Oldest', 'postDate', 'asc'],
            ['Most upvoted', 'upVote', 'desc'],
            ['Least upvoted', 'upVote', 'asc'],
            ['Name A-Z', 'title', 'asc'],
            ['Name Z-A', 'title', 'desc']
          ]"
          @sortOptionSelect="sortPostBy = $event"
        />
      </nav>
      <div class="bg-base-200 rounded-2xl border border-neutral w-full min-h-[32rem] h-auto overflow-hidden flex justify-center md:items-center">
        <PlanContainer v-if="postPlans.length > 0" pageName="profileview">
          <PlanCard
            v-for="plan in sortablePostPlans"
            :key="plan.id"
            :planData="plan"
          />
        </PlanContainer>
        <div v-else class="flex flex-col items-center text-sm w-[65%] mt-14 md:flex-col md:items-center gap-4">
          <div class="text-xl font-bold md:text-2xl">No post</div>
          <div>It seems like <span class="text-primary">{{ user.nickname }}</span> has not posted anything yet</div>
        </div>
      </div>
    </div>
  </PlannetLayout>
</template>