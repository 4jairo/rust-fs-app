import Swal from 'sweetalert2'
import '@sweetalert2/theme-dark/dark.css'
import { CopyRenameRules } from '../tauriApi/invokeApi'

export const changeOpenOnBootNotification = async (currentState: boolean) => {
  return await Swal.fire({
    title: 'Confirmation',
    html: `
      Do you want to run the application on startup? <br />
      Current state: <b>${currentState ? 'Enabled' : 'Disabled'}</b>`,
    icon: 'question',
    confirmButtonText: 'Yes',
    showDenyButton: true,
    denyButtonText: 'No', 
  })
}


export const existentFileNotification = async (fileName: string) => {
  return await Swal.fire({
    icon: 'error',
    title: 'Existent file',
    html: `'<b>${fileName}</b>' does exist in this folder`
  })
}

export const waitUntilAvaliableDirTreeNotification = async () => {
  return await Swal.fire({
    icon: 'warning',
    title: 'Loading...',
    html: 'currently there are drives loading, the result may not contain your search, <b>Continue?</b>',
    showCancelButton: true,
    cancelButtonColor: 'red',
    cancelButtonText: 'Wait',
    confirmButtonText: 'Continue'
  })
}

export const removeFileConfirmation = async (multipleFiles?: boolean) => {
  const str = multipleFiles ? 'files': 'file'

  return await Swal.fire({
    icon: 'warning',
    title: `Remove ${str}`,
    html: `Are you sure to delete this ${str}?`,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Remove'
  })
}

export const duplicatePathAlert = async (paths: string[]) => {
  const quantityVerb = paths.length === 1
    ? 'does exist'
    : 'are existent'

  const s = paths.length > 1 ? 's' : ''

  const result = await Swal.fire({
    icon: 'error',
    title: `Existent file${s}`,
    html: `<b>${paths.join(', ')}</b> ${quantityVerb} in this folder`,

    //OverWrite (btn 1)
    showConfirmButton: true,
    confirmButtonText: 'Overwrite',
    confirmButtonColor: '#008',

    // CreateNewName (btn 2)
    showDenyButton: true,
    denyButtonText: 'Create new name',
    denyButtonColor: '#800',

    //Skip (btn 3)
    showCancelButton: true,
    cancelButtonText: 'Skip',
    cancelButtonColor: '#080',

    //cancel
    showCloseButton: true,
  })

  if (result.isConfirmed) {
    return CopyRenameRules.OverWrite
  } else if (result.isDenied) {
    return CopyRenameRules.CreateNewName
  } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
    return CopyRenameRules.Skip
  }
}

export const showErrorAlert = async (error: string) => {
  return await Swal.fire({
    icon: 'error',
    title: 'Something happened!',
    html: error
  })
}

interface GetUserInput {
  title: string
  inputPlaceholder?: string
  inputValue?: string
}
export const getUserInputAlert = async (props: GetUserInput) => {
  return await Swal.fire({
    ...props,
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Accept',
    cancelButtonText: 'Cancel',
    preConfirm: (inputValue) => {
      if (inputValue) return inputValue
      
      Swal.showValidationMessage('You mut enter something');
    },
    inputValidator: (inputValue) => {
      if(props.inputValue === inputValue) {
        return `Invalid name: Same value as before`
      }

      const includesInvalidChars = /[<>\\\/|"':?*]/.test(inputValue)
      if(includesInvalidChars) {
        const markedInvalidChars = inputValue.replace(/[<>\\\/|':?*]/g, (char) => `<b style="color: red">${char}</b>`)
        return `Invalid characters detected: '${markedInvalidChars}'`
      }
    }
  })
}
