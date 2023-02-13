import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'

// API
import { getPublicGroup, postRegister } from 'src/utils/api'

// COMPONENTS
import { Loader } from 'src/components'

import './styles.scss'

const schema = yup
  .object({
    name: yup.string().required('Nama harus disisi'),
    noreg: yup
      .string()
      .required('No Registrasi harus disi')
      .matches(/^[0-9]+$/),
    phone_no: yup.string().required('No Handphone harus disi'),
    password: yup.string().required('Password harus disi'),
    confirmPassword: yup
      .string()
      .required('Konfirmasi Password harus disi')
      .oneOf([yup.ref('password')], 'Password tidak sesuai'),
    group_id: yup.string().required('Required').notOneOf(['select'], 'Grup harus dipilih'),
  })
  .required()

const Register = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  })

  // fetching api
  const { data } = useQuery('publicgroup', getPublicGroup, {
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message.detail)
      } else {
        toast.error(error.message)
      }
    },
  })

  const { isLoading, mutate } = useMutation(postRegister, {
    onSuccess: ({ data }) => {
      console.log(data)
      setIsOpenModal(true)
    },
    onError: ({ response }) => {
      console.log(response)
      toast.error(response.data.message.detail)
    },
  })

  const handleNumberTypeInput = (name) => {
    const allValue = getValues()
    const numberOnlyText = allValue[name].replace(/[^0-9.]/g, '')
    setValue(name, numberOnlyText)
  }

  const onSubmit = (data) => {
    mutate({
      noreg: data.noreg,
      name: data.name,
      phone_no: data.phone_no,
      password: data.password,
      group_id: data.group_id,
    })
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      {isLoading && <Loader />}
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1>Register</h1>
                  <div>
                    <CFormInput label="Nama" placeholder="Nama" {...register('name')} />
                    <div className="error-form">{errors.name?.message}</div>
                  </div>
                  <div>
                    <CFormInput
                      placeholder="No. Registrasi"
                      label="No. Registrasi"
                      {...register('noreg', {
                        setValueAs: (v) => String(v),
                        onChange: (e) => {
                          handleNumberTypeInput('noreg')
                        },
                      })}
                    />
                    <div className="error-form">{errors.noreg?.message}</div>
                  </div>

                  <div>
                    <CFormInput
                      placeholder="No. Handphone"
                      label="No. Handphone"
                      {...register('phone_no', {
                        setValueAs: (v) => String(v),
                        onChange: (e) => {
                          handleNumberTypeInput('phone_no')
                        },
                      })}
                    />
                    <div className="error-form">{errors.phone_no?.message}</div>
                  </div>

                  <div>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      label="Password"
                      {...register('password')}
                    />
                    <div className="error-form">{errors.password?.message}</div>
                  </div>
                  <div>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      label="Konfirmasi Password"
                      {...register('confirmPassword', {
                        validate: {
                          matchesPreviousPassword: (value) => {
                            const { password } = getValues()
                            return password === value || 'Passwords should match!'
                          },
                        },
                      })}
                    />
                    <div className="error-form">{errors.confirmPassword?.message}</div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <CFormSelect label="Grup" {...register('group_id')}>
                      <option defaultValue="select" value="select">
                        --- Pilih ---
                      </option>

                      {data?.data?.map((group) => (
                        <option key={group.group_id} value={group.group_id}>
                          {group.group_nm}
                        </option>
                      ))}
                    </CFormSelect>
                    <div className="error-form">{errors.group_id?.message}</div>
                  </div>

                  <div className="d-grid">
                    <CButton color="primary" type="submit">
                      Buat Akun
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
          <CModal visible={isOpenModal} onClose={() => setIsOpenModal(false)}>
            <CModalHeader>
              <CModalTitle>Sukses</CModalTitle>
            </CModalHeader>
            <CModalBody>Registrasi berhasil, login untuk mengakses sistem</CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={() => navigate('/login')}>
                Ok
              </CButton>
            </CModalFooter>
          </CModal>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
