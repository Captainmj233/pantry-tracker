'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, IconButton } from '@mui/material'
import { Add, Remove, Delete } from '@mui/icons-material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: '10px',
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const increaseQuantity = async (item) => {
    await addItem(item)
  }

  const decreaseQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await deleteDoc(docRef)
    await updateInventory()
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      p={3}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f7f7f7"
    >

      {/* Heading */}
      <Typography variant="h3" color="#8bc34a" textAlign="center" mb={4}>
        Welcome to Your Pantry Tracker
      </Typography>

      {/* Search Bar and Add Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="800px"
        mb={3}
      >
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: '#8bc34a',
            '&:hover': {
              backgroundColor: '#8bc34a',
            },
            marginRight: 3,
          }}
        >
          Add New Item
        </Button>

        <TextField
          label="Search Item"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width:'300px'}}
        />
      </Box>


      <Stack
        width="800px"
        height="300px"
        spacing={2}
        overflow="auto"
        alignItems="center"
        justifyContent="center"
        bgcolor="#ffffff"
        borderRadius="10px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        padding="20px"
      >
        {/* Headings */}
        <Box
          width="100%"
          height="60px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingX={2}
          bgcolor="#e0e0e0"
          borderRadius="5px"
          marginBottom={1}
        >
          <Typography variant={'h6'} color={'#555'} textAlign={'center'} sx={{ width: '40%' }}>
            Item
          </Typography>
          <Typography variant={'h6'} color={'#555'} textAlign={'center'} sx={{ width: '20%' }}>
            Quantity
          </Typography>
          <Typography variant={'h6'} color={'#555'} textAlign={'center'} sx={{ width: '40%' }}>
            Actions
          </Typography>
        </Box>

        {/* Inventory Items */}
        {filteredInventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            height={"50px"}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#8bc34a"
            paddingX={5}
            borderRadius="5px"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
            sx={{
              backgroundColor: quantity > 5 ? '#d4edda' : '#f8d7da',
            }}
          >
            <Typography variant={'h5'} color={'#333'} sx={{ width: '40%' }}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant={'h5'} color={'#333'} textAlign={'center'} sx={{ width: '20%' }}>
              {quantity}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '40%' }}>
              <IconButton onClick={() => increaseQuantity(name)} >
                <Add />
              </IconButton>
              <IconButton onClick={() => decreaseQuantity(name)} disabled={quantity <= 1} >
                <Remove />
              </IconButton>
              <IconButton onClick={() => removeItem(name)} sx={{ color: '#dc3545' }}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Modal for Adding New Item */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <TextField
            label="Item Name"
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
            sx={{ backgroundColor: '#8bc34a' }}
          >
            Add Item
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}
