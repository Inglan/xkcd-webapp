"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Dice5,
  Download,
  EllipsisVertical,
  LoaderCircle,
  Moon,
  Search,
  Share,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useAction,
  useMutation,
  useQuery,
} from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import clsx from "clsx";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useHotkeys } from "react-hotkeys-hook";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatePresence, motion } from "motion/react";
import SavedCard from "@/components/saved-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const [img, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [num, setNum] = useState(0);
  const [loading, setLoading] = useState(true);

  const getById = useAction(api.xkcd.getById);
  const getLatest = useAction(api.xkcd.getLatest);
  const { theme, setTheme } = useTheme();

  const saves = useQuery(api.saves.get, {});
  const userInfo = useQuery(api.account.info, {});
  const deleteAccountMutation = useMutation(api.account.deleteAccount);

  function loadById(id: number) {
    let previousNum = num;
    let previousImg = img;

    setNum(id);
    setLoading(true);

    getById({ id })
      .then((data) => {
        setTitle(data.title);
        setImg(data.img);
        setAlt(data.alt);
        if (data.img == previousImg) {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setNum(previousNum);
        toast.error("Something went wrong");
      });
  }

  useEffect(() => {
    getLatest({}).then((data) => {
      setNum(data.num);
      setTitle(data.title);
      setImg(data.img);
      setAlt(data.alt);
    });
  }, []);

  useHotkeys("ArrowRight", () => {
    loadById(num + 1);
  });
  useHotkeys("ArrowLeft", () => {
    loadById(num - 1);
  });
  useHotkeys("l", () => {
    loadById(num + 1);
  });
  useHotkeys("h", () => {
    loadById(num - 1);
  });

  const { signIn, signOut } = useAuthActions();

  return (
    <div className="h-screen w-screen flex flex-col items-center p-3">
      <div className="flex flex-row container m-auto gap-1 justify-center items-center">
        <Drawer direction="left">
          <DrawerTrigger className={buttonVariants({ variant: "default" })}>
            xkcd-webapp
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>About this webapp</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
        <div className="grow"></div>
        <AuthLoading>
          <Skeleton className="h-[20px] w-[75px] rounded-full" />
        </AuthLoading>
        <Authenticated>
          <Drawer direction="right">
            <DrawerTrigger className={buttonVariants({ variant: "ghost" })}>
              Saved
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Saved</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 flex flex-col gap-3 overflow-y-auto grow">
                <AnimatePresence>
                  {saves &&
                    saves.map((save) => (
                      <SavedCard
                        loadByIdAction={loadById}
                        comic={save}
                        key={save.num}
                      />
                    ))}
                  {saves && saves.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                      No saved comics yet.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </DrawerContent>
          </Drawer>
        </Authenticated>
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
                        Are you sure you want to delete your account? This
                        action cannot be undone.
                        <br />
                        Yes, as soon as you press continue <em>ALL</em> your
                        data will be erased forever. I don't retain any of it.
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setTheme(theme == "dark" ? "light" : "dark");
          }}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col max-w-[95%] max-h-[95%]">
          {loading && <LoaderCircle className="animate-spin" />}

          {img && (
            <img
              className={clsx(loading && "hidden", "dark:invert")}
              onLoad={() => {
                setLoading(false);
              }}
              src={img}
              alt={alt}
            />
          )}
        </div>
      </div>
      <ActionsBar
        title={title}
        alt={alt}
        num={num}
        setNum={setNum}
        loadById={loadById}
        loading={loading}
      />
    </div>
  );
}

function ActionsBar({
  title,
  alt,
  num,
  setNum,
  loadById,
  loading,
}: {
  title: string;
  alt: string;
  num: number;
  setNum: (num: number) => void;
  loadById: (id: number) => void;
  loading: boolean;
}) {
  const saveMutation = useMutation(api.saves.toggle);
  const isSaved = useQuery(api.saves.isSaved, { num });
  const [saving, setSaving] = useState(false);
  return (
    <div className="flex gap-2 p-3 md:w-fit w-full border-t md:border md:rounded-md fixed bottom-0 md:bottom-3 bg-background">
      <Badge>#{num}</Badge>
      <div className="grow"></div>
      <Button disabled={loading} size="icon" variant="ghost">
        <Search />
      </Button>
      <Button
        disabled={num === 1 || loading}
        size="icon"
        variant="ghost"
        onClick={() => {
          if (num - 1 > 0) {
            loadById(num - 1);
          }
        }}
      >
        <ChevronLeft />
        <span className="sr-only">Previous</span>
      </Button>
      <Button
        disabled={loading}
        size="icon"
        variant="ghost"
        onClick={() => {
          if (num + 1 > 0) {
            loadById(num + 1);
          }
        }}
      >
        <ChevronRight />
        <span className="sr-only">Next</span>
      </Button>
      <Button disabled={loading} size="icon" variant="ghost">
        <Dice5 />
        <span className="sr-only">Random</span>
      </Button>
      <Authenticated>
        <Button
          disabled={loading}
          size="icon"
          variant="ghost"
          onClick={() => {
            if (!saving) {
              setSaving(true);
              saveMutation({ num: num }).then(() => setSaving(false));
            }
          }}
        >
          {saving ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            <Bookmark className={clsx(isSaved && "text-red-500")} />
          )}
          <span className="sr-only">Save</span>
        </Button>
      </Authenticated>
      <MoreButton title={title} description={alt} />
    </div>
  );
}

function MoreButton({
  title = "More",
  description = "",
}: {
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      <Button size="icon" variant="ghost" onClick={() => setOpen(!open)}>
        <EllipsisVertical />
      </Button>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost">
                <Share />
                Share
              </Button>
              <Button variant="ghost">
                <Download />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-left">{title}</DrawerTitle>
              <DrawerDescription className="text-left">
                {description}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="grid grid-cols-2 gap-3">
              <Button variant="ghost">
                <Share />
                Share
              </Button>
              <Button variant="ghost">
                <Download />
                Download
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
