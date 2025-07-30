"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function AccountDrawer() {
  const userInfo = useQuery(api.account.info, {});
  const deleteAccountMutation = useMutation(api.account.deleteAccount);
  const { signIn, signOut } = useAuthActions();

  return (
    <Drawer direction="right">
      <DrawerTrigger className={buttonVariants({ variant: "ghost" })}>
        Account
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Account</DrawerTitle>
          <Unauthenticated>
            <DrawerDescription>Signed out</DrawerDescription>
          </Unauthenticated>
          <Authenticated>
            <DrawerDescription>{userInfo?.name}</DrawerDescription>
          </Authenticated>
        </DrawerHeader>
        <Unauthenticated>
          <div className="p-4 flex flex-col gap-3">
            <Button disabled>Google</Button>
            <Button
              onClick={() => {
                toast.promise(signIn("github"), {
                  loading: "Processing",
                  success: "Redirecting to Github",
                  error: "Something went wrong",
                });
              }}
            >
              Github
            </Button>
            <Button
              onClick={() => {
                toast.promise(signIn("anonymous"), {
                  loading: "Processing",
                  success: "Signed in as anonymous",
                  error: "Something went wrong",
                });
              }}
              variant="ghost"
            >
              Anonymous
            </Button>
          </div>
        </Unauthenticated>
        <DrawerFooter>
          <Authenticated>
            {!userInfo?.anonymous && (
              <Button
                variant="outline"
                onClick={() =>
                  toast.promise(signOut(), {
                    loading: "Signing out...",
                    success: "Signed out",
                    error: "Something went wrong",
                  })
                }
              >
                Sign out
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger
                className={buttonVariants({ variant: "destructive" })}
              >
                Delete account
              </AlertDialogTrigger>
              <AlertDialogContent className="border-red-400 bg-red-100 dark:bg-red-950">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                    <br />
                    Yes, as soon as you press continue <em>ALL</em> your data
                    will be erased forever. I don't retain any of it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={() => {
                      toast.promise(
                        new Promise<void>((resolve) => {
                          deleteAccountMutation({}).then(() => {
                            signOut().then(() => {
                              resolve();
                            });
                          });
                        }),
                        {
                          loading: "Deleting account...",
                          success: "Account deleted",
                          error: "Something went wrong",
                        },
                      );
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Authenticated>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
