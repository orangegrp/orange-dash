<script lang="ts">
    import { onMount } from "svelte";
    import AppHeader from "../../components/AppHeader.svelte";
    import AppContent from "../../components/AppContent.svelte";

    import { Button, Note, Text } from "geist-ui-svelte";
    import type { DashUser } from "$lib/auth/dash";
    import { page } from "$app/stores";
    import NavButton from "../../components/NavButton.svelte";
    import { writable } from "svelte/store";
    import Table from "../../components/table/Table.svelte";
    import Row from "../../components/table/Row.svelte";
    import Item from "../../components/table/Item.svelte";
    
    let currentSectionIndex = writable<number>(0);

    let accountType = "";

    onMount(() => {
        window.history.replaceState({}, "", "/app/admin");

        const dashAccount = $page.data.dash_account as DashUser;
        accountType = dashAccount.role;
    });

    let hover = false;
</script>

{#if accountType === "Admin" || accountType === "Root"}
    <AppHeader Title="Admin Area"></AppHeader>
    <AppContent class="py-8 px-6 sm:px-8 md:px-10 lg:px-16 xl:px-36 2xl:px-48">
        <svelte:fragment slot="navigation">
            <div
                class="flex md:flex-col flex-row justify-start gap-y-1 gap-x-2 overflow-x-auto w-full min-w-fit max-w-[15vw]"
            >
                <Text size="xs" class="display-none md:block ml-2">ACCOUNT MANAGEMENT</Text>
                <NavButton
                    active={$currentSectionIndex === 0}
                    btnClicked={() => currentSectionIndex.set(0)}
                    >User Accounts
                </NavButton>
            </div>
        </svelte:fragment>
        <svelte:fragment slot="content">
            <Table>
                  <Row header>
                    <Item header>Company</Item>
                    <Item header>Contact</Item>
                    <Item header>Country</Item>
                  </Row>
                  <Row>
                    <Item>Alfreds Futterkiste</Item>
                    <Item>Maria Anders</Item>
                    <Item>Germany</Item>
                  </Row>
                  <Row>
                    <Item>CenRowo comercial Moctezuma</Item>
                    <Item>Francisco Chang</Item>
                    <Item>Mexico</Item>
                  </Row>
                  <Row>
                    <Item>Ernst Handel</Item>
                    <Item>Roland Mendel</Item>
                    <Item>AusRowia</Item>
                  </Row>
                  <Row  onmouseenter={() => (hover = true)} onmouseleave={() => (hover = false)}>
                    <Item>Island Rowading
                        <Button class="{hover ? "" : "hidden"}">Hi</Button>
                    </Item>
                    <Item>Helen Bennett</Item>
                    <Item>UK</Item>
                  </Row>
                  <Row>
                    <Item>Laughing Bacchus Winecellars</Item>
                    <Item>Yoshi Tannamuri</Item>
                    <Item>Canada</Item>
                  </Row>
                  <Row>
                    <Item>Magazzini Alimentari Riuniti</Item>
                    <Item>Giovanni Rovelli</Item>
                    <Item>Italy</Item>
                  </Row>
            </Table>
        </svelte:fragment>
    </AppContent>
{:else}
    <main class="m-8 flex flex-col place-items-center">
        <Note color="error" label={false}>
            <div class="flex flex-row gap-x-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                    />
                </svg>
                Access Denied. This feature is not available to this Dash account.
            </div>
        </Note>
    </main>
{/if}
