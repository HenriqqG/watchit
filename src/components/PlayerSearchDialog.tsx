import { Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PlayerSearchResultCard } from "./PlayerSearchResultCard";
import { Snackbar, Alert, type SnackbarCloseReason } from "@mui/material";
import type { NotificationState } from "../hooks/useSnackbars";
import Loading from "./general-components/Loading";
import { useLanguage } from "../contexts/LanguageContext";
import { tl } from "../translations/translation";

type PlayerSearchDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  returnedList: any[];
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (item: any) => void;
  cleanList: () => void;
  avoidDefaultDomBehavior?: (event: Event) => void;
  loadingPlayers: boolean;
  notification: NotificationState,
  handleSnackBarClose: (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
};

export function PlayerSearchDialog({
  open,
  setOpen,
  returnedList,
  onInput,
  onSelect,
  cleanList,
  avoidDefaultDomBehavior,
  loadingPlayers,
  notification,
  handleSnackBarClose
}: PlayerSearchDialogProps) {

  const { currentLanguage } = useLanguage();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button className="w-full text-white focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 border-2 border-solid border-zinc-400">
          <svg
            className="w-3.5 h-3.5 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 21">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>
          {tl(currentLanguage, 'dialogs.player_search.trigger_button')}
        </button>
      </Dialog.Trigger>

      <VisuallyHidden>
        <Dialog.Title>{tl(currentLanguage, 'dialogs.player_search.title')}</Dialog.Title>
      </VisuallyHidden>

      <Dialog.Content
        align="start"
        maxWidth="100%"
        onPointerDownOutside={avoidDefaultDomBehavior}
        onInteractOutside={avoidDefaultDomBehavior}>
        <Flex direction="row">
          <TextField.Root
            placeholder={tl(currentLanguage, 'dialogs.player_search.placeholder')}
            className="w-full"
            onInput={onInput}>
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>

          <Dialog.Close onClick={cleanList}>
            <button className="text-white font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center me-2">
              <svg
                className="w-3.5 h-3.5 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 21">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
            </button>
          </Dialog.Close>
        </Flex>

        <br />
        {loadingPlayers && <Loading />}
        {!loadingPlayers && returnedList.length > 0 && (
          <>
            <Text as="div" size="3" weight="bold" mb="3">
              {tl(currentLanguage, 'dialogs.player_search.players_found', { count: returnedList.length.toString() })}
            </Text>
            <Flex className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 w-full">
                {returnedList.map((item, key) => (
                  <PlayerSearchResultCard
                    key={key}
                    item={item}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </Flex>
          </>
        )}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleSnackBarClose}>
          <Alert
            onClose={handleSnackBarClose}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Dialog.Content>
    </Dialog.Root>
  );
}
