import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPortal from './ReactPortal';

interface Props {
    isOpen?: boolean;
    showButton?: boolean;
    openButtonText?: string;
    dialogTitle?: string;
    dialogContent?: string;
    onActionAccepted?: () => void | null;
    onActionRejected?: () => void | null;
}

export default function ActionDialog({
  isOpen = false,
  showButton = true,
  openButtonText = 'Open',
  dialogTitle = 'Dialog title',
  dialogContent = 'Dialog content',
  onActionAccepted,
  onActionRejected,
}: Props) {
  const [open, setOpen] = useState(isOpen);

  const handleClickOpen = onActionAccepted || (() => {
    setOpen(true);
  });

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    if (onActionRejected) onActionRejected();
  };

  const { t } = useTranslation();

  return (
    <ReactPortal wrapperId="root-portal">
      <div>
        { showButton && (
          <Button variant="outlined" onClick={handleClickOpen}>
            {t(openButtonText) as string}
          </Button>
        )}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth={'xs'}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" textAlign={'center'}>
            {t(dialogTitle) as string}
          </DialogTitle>
          <DialogContent>
            <DialogContentText textAlign={'center'} id="alert-dialog-description">
              {t(dialogContent) as string}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={onActionAccepted} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ReactPortal>
  );
}