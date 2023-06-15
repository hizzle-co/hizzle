## State management package.

### Installation

```bash
npm install @hizzle/store
```

### Usage

```typescript
import { initStore, useRecords } from '@hizzle/store';

// Init a store for a specific namespace and collection.
// Do this once in your app.
initStore( 'noptin', 'subscribers' );

// In your component, use the useRecords hook to get the records.
export ListRecords = ( {per_page} ) => {
    const { data, total, summary, isResolving, hasResolutionFailed, getResolutionError } = useRecords( 'noptin', 'subscribers', { per_page } );

    // Check if the records are still loading.
    if ( isResolving() ) {
        return <div>Loading...</div>;
    }

    // Check if the records failed to load.
    if ( hasResolutionFailed() ) {
        return <div>Error: { getResolutionError() }</div>;
    }

    // Render the records.
    return (
        <div>
            <ul>
                { data.map( ( record ) => <li key={ record.id }>{ record.email }</li> ) }
            </ul>
            <p>Total: { total }</p>
            <p>Summary: { summary }</p>
        </div>
    );
}
```
