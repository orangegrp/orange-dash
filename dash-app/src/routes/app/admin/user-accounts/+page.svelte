<script lang="ts">
    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import {
        Text,
    } from "geist-ui-svelte";


    let userId = "";
    let userName = "";
    let loginMethods = [];
    let OAuth2_Id = "";
    let accountType = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/admin/user-accounts");

        const dashAccount = $page.data.dash_account as DashUser;

        userId = dashAccount.id;
        userName = dashAccount.username ? `${dashAccount.username}` : "";
        loginMethods = dashAccount.login_methods;
        OAuth2_Id = dashAccount.oauth2_id;
        accountType = dashAccount.role;
    });

</script>

<div class="w-full">
    <Text type="h3" class="font-light mb-4">User Accounts</Text>
    Feature unavailable at this time.
</div>