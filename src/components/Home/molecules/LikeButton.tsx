import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base';

const LikeButton = ({onPress}: any) => {
    
    const [liked, setLiked] = React.useState(false);
    const handlePress = () => {
        setLiked(!liked);
        if (onPress) {
            onPress(!liked);
        }
    }

  return (
      <TouchableOpacity onPress={handlePress}>
          <Icon
              type='material'
              name={liked ? 'favorite' : 'favorite-border'}
              color={liked ? 'red' : 'black'}
          />
      </TouchableOpacity>
      
  )
}

export default LikeButton