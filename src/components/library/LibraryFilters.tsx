
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Search, Grid3X3, List, Table, Filter, SortAsc, SortDesc,
  Grid2X2, LayoutGrid
} from "lucide-react";
import { SortField, SortDirection, ViewMode } from "@/pages/Library";

interface LibraryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  gridColumns: number;
  setGridColumns: (columns: number) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
}

export const LibraryFilters = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  gridColumns,
  setGridColumns,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}: LibraryFiltersProps) => {
  return (
    <Card className="backdrop-blur-md bg-white/5 border border-white/10 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
          <Button
            variant={viewMode === 'gallery' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('gallery')}
            className={viewMode === 'gallery' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'}
          >
            <Table className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid Size (only for gallery view) */}
        {viewMode === 'gallery' && (
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
            {[3, 4, 5].map((cols) => (
              <Button
                key={cols}
                variant={gridColumns === cols ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setGridColumns(cols)}
                className={gridColumns === cols ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'}
              >
                {cols === 3 && <Grid2X2 className="h-4 w-4" />}
                {cols === 4 && <Grid3X3 className="h-4 w-4" />}
                {cols === 5 && <LayoutGrid className="h-4 w-4" />}
              </Button>
            ))}
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-2">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="original_name">По имени</option>
            <option value="uploaded_at">По дате</option>
            <option value="file_size">По размеру</option>
            <option value="mime_type">По типу</option>
          </select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="text-slate-300 hover:text-white hover:bg-white/10"
          >
            {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};
