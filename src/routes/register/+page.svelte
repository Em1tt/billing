<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { pb, currentUser } from "$lib/pocketbase";
	import { onMount } from "svelte";
    import { Turnstile } from 'svelte-turnstile';

    let name: HTMLInputElement;
    let nameMessage: string = "Name cannot be empty.";
    let email: HTMLInputElement;
    let emailMessage: string = "Please enter a valid e-mail address.";
    let password: HTMLInputElement;
    let passwordMessage: string;
    let passwordConfirm: HTMLInputElement;
    let passwordConfirmMessage: string;
    let turnstileMessage: string;

    let hasUppercase: boolean = false;
    let hasLowercase: boolean = false;
    let hasNumber: boolean = false;
    let hasLength: boolean = false;

    let passwordHint: HTMLElement;
    let hintHeight: number = 0;

    function validateName(){
        if(name.value.trim() == ""){
            nameMessage = "Name cannot be empty.";
        }else{
            nameMessage = "";
        }
        name.setCustomValidity(nameMessage);
    }

    function validatePasswordConfirm(){
        const pw = password.value.trim();
        const pwConfirm = passwordConfirm.value.trim();
        if(pw == pwConfirm){
            passwordConfirmMessage = "";
        }else{
            passwordConfirmMessage = "Passwords do not match.";
        }
        passwordConfirm.setCustomValidity(passwordConfirmMessage);
    }

    function validateEmail(){
        if(email.value.trim() == ""){
            emailMessage = "E-Mail can't be empty.";
        }else if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email.value.trim())){
            emailMessage = "";
        }else{
            emailMessage = "Please enter a valid E-Mail address.";
        }
        email.setCustomValidity(emailMessage);
    }

    function validatePassword(){
        const pw = password.value.trim();
        if(/[A-Z]/.test(pw)) hasUppercase = true; else hasUppercase = false;
        if(/[a-z]/.test(pw)) hasLowercase = true; else hasLowercase = false;
        if(/[0-9]/.test(pw)) hasNumber = true; else hasNumber = false;
        if(pw.length >= 8) hasLength = true; else hasLength = false;
        if((hasUppercase && hasLowercase && hasNumber && hasLength)) {
            passwordMessage = "";
            return password.setCustomValidity(passwordMessage);
        };;
        if(!hasUppercase) {
            passwordMessage = "Password must contain an uppercase letter.";
            return password.setCustomValidity(passwordMessage);
        };
        if(!hasLowercase) {
            passwordMessage = "Password must contain a lowercase letter.";
            return password.setCustomValidity(passwordMessage);
        };
        if(!hasNumber) {
            passwordMessage = "Password must contain a number.";
            return password.setCustomValidity(passwordMessage);
        };
        if(!hasLength) {
            passwordMessage = "Password must be at least 8 characters long.";
            return password.setCustomValidity(passwordMessage);
        };
    }

    function expandHint(){
        const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
        if(isReduced) return;
        passwordHint.style.setProperty("height", `${hintHeight}px`);
        passwordHint.style.setProperty("border-width", `1px`);
        passwordHint.style.setProperty("margin-top", `12px`);
        passwordHint.style.setProperty("padding", `8px`);
    };

    function hideHint(){
        const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
        if(isReduced) return;
        passwordHint.style.setProperty("height", `0`);
        passwordHint.style.setProperty("border-width", `0`);
        passwordHint.style.setProperty("margin-top", `0`);
        passwordHint.style.setProperty("padding", `0`);
    };

    onMount(async()=>{
        if($currentUser){
            goto("/");
        }
        hintHeight = passwordHint.scrollHeight + 16;
    });

    let loading: boolean = false;
    let reset: () => void | undefined;

</script>

<div class="grid w-full h-full place-items-center">
    <div class="px-20 py-8 border border-slate-400/40 rounded">
        <h1 class="text-slate-600 text-3xl font-semibold text-center">Register</h1>
        <form use:enhance={()=>{
            loading = true;
            return async ({result}) => {
                await applyAction(result);
                const {nameData, emailData, passwordData, passwordConfirmData, turnstileData} = $page.form;
                if(nameData){
                    nameMessage = nameData.message;
                    name.setCustomValidity(nameMessage);
                }
                if(emailData){
                    emailMessage = emailData.message;
                    email.setCustomValidity(emailMessage);
                }
                if(passwordData){
                    passwordMessage = passwordData.message;
                    password.setCustomValidity(passwordMessage);
                }
                if(passwordConfirmData){
                    passwordConfirmMessage = passwordConfirmData.message;
                    passwordConfirm.setCustomValidity(passwordConfirmMessage);
                }
                if(turnstileData){
                    turnstileMessage = turnstileData.message;
                }
                reset?.();
                loading = false;
                if($page.form.success){
                try{
                    await pb.collection('users').authWithPassword(email.value, password.value);
                    await goto("/");
                }catch(e){
                    console.log(e);        
                }
            }
            }
        }} method="POST">
            <fieldset class="relative mt-8 flex items-center gap-2">
                <input on:change={validateName} bind:this={name} placeholder=" " type="text" name="name" id="name" class="p-2 w-full bg-transparent border border-slate-400 invalid:border-red-500 invalid:text-red-500 placeholder-shown:border-slate-400/40 rounded focus:border-sky-500 outline-none text-slate-600 focus:text-sky-500 peer">
                <label for="name" class="absolute pointer-events-none duration-100 peer-invalid:text-red-500 motion-reduce:duration-0 text-slate-400 -top-3 left-1 peer-focus:-top-3 peer-focus:left-1 bg-slate-200 rounded-full px-1 peer-focus:text-sky-500 py-0 h-5 peer-placeholder-shown:top-2 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:left-3">Full name</label>
                <div class="hidden peer-invalid:block text-red-500 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 peer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg> 
                    <div class="hidden peer-hover:block absolute bottom-8 left-2 border border-red-400 py-1 px-2 pointer-events-none bg-red-200 rounded rounded-bl-none w-fit max-w-[240px]">
                        <p class="text-sm block min-w-[120px]">{nameMessage}</p>
                        <div class="relative">
                            <div class="absolute h-2 w-2 border-t-8 border-l-0 border-r-8 border-b-0 border-transparent border-t-red-400 top-1 -left-[9px]"></div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <fieldset class="relative mt-3 flex items-center gap-2">
                <input on:input={validateEmail} bind:this={email} placeholder=" " type="email" name="email" id="email" class="p-2 w-full bg-transparent border border-slate-400 invalid:border-red-500 invalid:text-red-500 placeholder-shown:border-slate-400/40 rounded focus:border-sky-500 outline-none text-slate-600 focus:text-sky-500 peer">
                <label for="email" class="absolute pointer-events-none duration-100 peer-invalid:text-red-500 motion-reduce:duration-0 text-slate-400 -top-3 left-1 peer-focus:-top-3 peer-focus:left-1 bg-slate-200 rounded-full px-1 peer-focus:text-sky-500 py-0 h-5 peer-placeholder-shown:top-2 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:left-3">E-Mail</label>
                <div class="hidden peer-invalid:block text-red-500 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 peer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg> 
                    <div class="hidden peer-hover:block absolute bottom-8 left-2 border border-red-400 py-1 px-2 pointer-events-none bg-red-200 rounded rounded-bl-none w-fit max-w-[240px]">
                        <p class="text-sm block min-w-[120px]">{emailMessage}</p>
                        <div class="relative">
                            <div class="absolute h-2 w-2 border-t-8 border-l-0 border-r-8 border-b-0 border-transparent border-t-red-400 top-1 -left-[9px]"></div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <fieldset class="relative mt-3 flex items-center gap-2">
                <input on:change={validatePasswordConfirm} on:input={validatePassword} on:focusin={expandHint} on:focusout={hideHint} bind:this={password} placeholder=" " type="password" name="password" id="password" class="p-2 bg-transparent w-full border border-slate-400 invalid:border-red-500 invalid:text-red-500 placeholder-shown:border-slate-400/40 rounded focus:border-sky-500 outline-none text-slate-600 focus:text-sky-500 peer">
                <label for="password" class="absolute pointer-events-none duration-100 peer-invalid:text-red-500 motion-reduce:duration-0 text-slate-400 -top-3 left-1 peer-focus:-top-3 peer-focus:left-1 bg-slate-200 rounded-full px-1 peer-focus:text-sky-500 py-0 h-5 peer-placeholder-shown:top-2 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:left-3">Password</label>
                <div class="hidden peer-invalid:block text-red-500 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 peer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg> 
                    <div class="hidden peer-hover:block absolute bottom-8 left-2 border border-red-400 py-1 px-2 pointer-events-none bg-red-200 rounded rounded-bl-none w-fit max-w-[240px]">
                        <p class="text-sm block min-w-[120px]">{passwordMessage}</p>
                        <div class="relative">
                            <div class="absolute h-2 w-2 border-t-8 border-l-0 border-r-8 border-b-0 border-transparent border-t-red-400 top-1 -left-[9px]"></div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <div bind:this={passwordHint} class="bg-sky-200 border-sky-400 rounded h-0 overflow-hidden duration-200 motion-reduce:h-auto motion-reduce:p-2 motion-reduce:border motion-reduce:mt-3">
                <p class="flex items-center gap-1 {hasUppercase ? "text-green-600" : "text-red-600"}">
                    {#if hasUppercase}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      
                    {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    {/if}
                    Uppercase letter
                </p>
                <p class="flex items-center gap-1 {hasLowercase ? "text-green-600" : "text-red-600"}">
                    {#if hasLowercase}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      
                    {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    {/if}
                    Lowercase
                </p>
                <p class="flex items-center gap-1 {hasNumber ? "text-green-600" : "text-red-600"}">
                    {#if hasNumber}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      
                    {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    {/if}
                    At least 1 number
                </p>
                <p class="flex items-center gap-1 {hasLength ? "text-green-600" : "text-red-600"}">
                    {#if hasLength}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      
                    {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    {/if}
                    At least 8 characters
                </p>
            </div>
            <fieldset class="relative mt-3 flex items-center gap-2">
                <input on:input={validatePasswordConfirm} on:change={validatePasswordConfirm} bind:this={passwordConfirm} placeholder=" " type="password" name="passwordConfirm" id="passwordConfirm" class="p-2 w-full bg-transparent border border-slate-400 invalid:border-red-500 invalid:text-red-500 placeholder-shown:border-slate-400/40 rounded focus:border-sky-500 outline-none text-slate-600 focus:text-sky-500 peer">
                <label for="passwordConfirm" class="absolute pointer-events-none duration-100 peer-invalid:text-red-500 motion-reduce:duration-0 text-slate-400 -top-3 left-1 peer-focus:-top-3 peer-focus:left-1 bg-slate-200 rounded-full px-1 peer-focus:text-sky-500 py-0 h-5 peer-placeholder-shown:top-2 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:left-3">Confirm Password</label>
                <div class="hidden peer-invalid:block text-red-500 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 peer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg> 
                    <div class="hidden peer-hover:block absolute bottom-8 left-2 border border-red-400 py-1 px-2 pointer-events-none bg-red-200 rounded rounded-bl-none w-fit max-w-[240px]">
                        <p class="text-sm block min-w-[120px]">{passwordConfirmMessage}</p>
                        <div class="relative">
                            <div class="absolute h-2 w-2 border-t-8 border-l-0 border-r-8 border-b-0 border-transparent border-t-red-400 top-1 -left-[9px]"></div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <fieldset class="relative mt-3 flex items-center gap-2">
                <button type="submit" class="p-2 cursor-pointer bg-sky-200 border border-sky-400 text-sky-600 hover:text-sky-800 hover:border-sky-600 w-full rounded">
                    {#if loading}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mx-auto animate-spin">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>                      
                    {:else}
                        Register
                    {/if}
                </button>
            </fieldset>
            {#if turnstileMessage}
                <p class="text-center text-red-500">{turnstileMessage}</p>
            {/if}
            <Turnstile siteKey="0x4AAAAAAAJRELri_iqccqJu" size="invisible" bind:reset/>
        </form>
    </div>
</div>