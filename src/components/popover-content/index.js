import React from 'react';
import {Switch} from "@blueprintjs/core";

import './styles.scss';

const PopoverContent = props => (
    <div className='popover-content'>
        {
            props.items.map(item => (
                <div className='popover-content_row' key={item.key}>
                    <div className='switch-container'>
                        <Switch
                            onChange={e => props.getSwitchChangeState(e, item)}
                            checked={item.value}
                        />
                    </div>
                    <div className='column-name'>{item.key}</div>
                </div>
            ))
        }
    </div>
);

export default PopoverContent
