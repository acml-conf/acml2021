module Jekyll
  module DateTimeFilter
    def to_utc(date)
      time(date).utc
    end

    def to_utc_time_range(start_at, end_at)
      start_at = to_utc(start_at)
      end_at = to_utc(end_at)
      to_time_range(start_at, end_at)
    end

    def to_time_range(start_at, end_at)
      day_diff = end_at.day - start_at.day
      output = date(start_at, "%a, %e %b. %H:%M") + " - " + date(end_at, "%H:%M")
      if day_diff > 0
        output += " [+"+day_diff.to_s+" day]"
      end
      output +" "+ date(start_at, "(%Z)")
    end
  end
end

Liquid::Template.register_filter(Jekyll::DateTimeFilter)