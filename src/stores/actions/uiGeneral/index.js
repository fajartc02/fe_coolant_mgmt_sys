export const SET_THEME = 'uiGeneral/SET_THEME'

export const setTheme = (payload) => (dispatch) => {
  dispatch({
    type: SET_THEME,
    payload,
  })
}
