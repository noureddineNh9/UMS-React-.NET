import PropTypes from 'prop-types';
import { Button, ListItem } from '@material-ui/core';
import NavItem from '../Components/NavItem';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
  const MultiNavItem = ({
    icon: Icon,
    title,
    items,
    ...rest
  }) => {
  
    return (
        <div id="accordion">
      <ListItem
        disableGutters
        sx={{
          display: 'flex',
          py: 0
        }}
        {...rest}
      >
        <Button
            className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"

          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
            justifyContent: 'flex-start',
            letterSpacing: 0,
            py: 1.25,
            textTransform: 'none',
            width: '100%',
            '& svg': {
              mr: 1
            }
          }}
        >
          {Icon && (
            <Icon size="20" />
          )}
          <span>
            {title}
          </span>
        </Button>
      </ListItem>

        <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
          {
            items.map( (item, index) => <NavItem
              className="ml-2"
              href={item.href}
              key={index}
              title={item.title}
              icon=""
            />
            )
          }
        </div>


      </div>
    );
  };
  
  MultiNavItem.propTypes = {
    href: PropTypes.string,
    icon: PropTypes.elementType,
    title: PropTypes.string
  };
  
  export default MultiNavItem;
  